/**
 * Product Contents Seed Script
 * 
 * Gemini 2.0 Flash를 사용해 패션 상품 설명과 가짜 리뷰를 생성하고,
 * text-embedding-004로 벡터화하여 Supabase product_contents 테이블에 저장합니다.
 * 
 * Usage: node scripts/seed_product_contents.mjs
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !GEMINI_API_KEY) {
    console.error('❌ 필수 환경 변수가 누락되었습니다 (.env.local 확인 필요)');
    process.exit(1);
}

// Supabase client with service role (bypasses RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Gemini API endpoints - Using gemini-2.0-flash for high quality content
const GEMINI_FLASH_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
const EMBEDDING_URL = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`;

// Fashion categories for diverse content
const CATEGORIES = [
    { name: '아우터', items: ['캐시미어 코트', '레더 자켓', '구스다운 패딩', '메리노울 가디건', '봄버 점퍼'] },
    { name: '상의', items: ['코마사 티셔츠', '프렌치 린넨 셔츠', '캐시미어 니트', '실크 블라우스', '오가닉 코튼 후드'] },
    { name: '하의', items: ['셀비지 데님', '울 슬랙스', '플리츠 스커트', '린넨 반바지', '테크니컬 레깅스'] },
    { name: '원피스', items: ['저지 미니원피스', '새틴 롱원피스', '테일러드 점프수트', '트위드 투피스'] },
    { name: '액세서리', items: ['베지터블 레더백', '파나마 햇', '캐시미어 스카프', '이태리 레더 벨트', '스털링 실버 주얼리'] }
];

/**
 * 기존 데이터 삭제
 */
async function clearExistingData() {
    console.log('🗑️  기존 데이터 삭제 중...');
    const { error } = await supabase
        .from('product_contents')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // 모든 데이터 삭제

    if (error) {
        console.error('삭제 실패:', error.message);
    } else {
        console.log('✅ 기존 데이터 삭제 완료\n');
    }
}

/**
 * Gemini 2.0 Flash로 상품 설명과 리뷰 생성
 */
async function generateProductContent(category, itemType, index) {
    const prompt = `당신은 프리미엄 패션 편집샵의 MD(머천다이저)입니다.

다음 패션 상품에 대해 전문적이고 상세한 정보를 JSON으로 생성해주세요:
- 카테고리: ${category}
- 상품 종류: ${itemType}

[필수 포함 내용]
1. 상품명: 소재와 스타일을 반영한 고급스러운 이름 (예: "이태리 캐시미어 혼방 싱글 코트")
2. 설명: 300자 이상, 반드시 다음 포함:
   - 소재 상세 (원산지, 혼용률, 원사 종류)
   - 제작 공법 (텐타 가공, 해리 테이핑, 바이오 워싱 등)
   - 핏과 실루엣 특징
   - 스타일링 제안
3. 리뷰: 실제 구매자의 생생한 후기 (소재감, 착용감, 사이즈 피드백 포함)

다음 JSON 형식으로만 응답해주세요:
{
  "productName": "소재+스타일 반영 상품명",
  "description": "소재, 공법, 핏, 스타일링을 포함한 상세 설명 (300자 이상)",
  "review": "실제 구매자 리뷰 (150자 이상, 소재감과 착용 후기)",
  "rating": 평점 (4-5),
  "brand": "가상의 프리미엄 브랜드명",
  "materials": ["주요 소재1", "소재2"],
  "techniques": ["공법1", "공법2"]
}`;

    try {
        const response = await fetch(GEMINI_FLASH_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.9,
                    maxOutputTokens: 2048
                }
            })
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Gemini API error: ${response.status} - ${errorBody.slice(0, 200)}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No JSON found in response');
        }

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error(`Error generating content for ${category}/${itemType}:`, error.message);
        const FALLBACK_TEMPLATES = [
            {
                desc: `미니멀한 감성과 실용성을 겸비한 ${category} 아이템입니다. 군더더기 없는 깔끔한 실루엣으로 어떤 룩에도 자연스럽게 어우러지며, 탄탄한 봉제 마감으로 오랫동안 변형 없이 착용하실 수 있습니다.`,
                review: `심플해서 자주 손이 가요. 마감도 꼼꼼하고 핏이 딱 떨어져서 마음에 듭니다.`
            },
            {
                desc: `클래식한 디자인을 현대적으로 재해석한 ${itemType}입니다. 부드러운 터치감의 프리미엄 소재를 사용하여 착용감이 뛰어나며, 은은한 광택감이 고급스러움을 더해줍니다. 격식 있는 자리부터 캐주얼한 모임까지 활용도가 높습니다.`,
                review: `생각보다 훨씬 고급스러워요. 소재가 부드럽고 몸에 감기는 느낌이 좋네요.`
            },
            {
                desc: `트렌디한 오버핏 실루엣이 돋보이는 ${category}입니다. 여유로운 핏감으로 체형을 자연스럽게 커버해주며, 활동성이 좋아 데일리 아이템으로 제격입니다. 유니크한 디테일이 스타일 포인트가 되어줍니다.`,
                review: `핏이 정말 예뻐요! 오버핏인데 부해보이지 않고 스타일리시해보입니다.`
            },
            {
                desc: `장인정신이 깃든 하이엔드 퀄리티의 ${itemType}입니다. 엄선된 1등급 원단만을 사용하여 제작되었으며, 시간이 지날수록 빈티지한 멋이 살아납니다. 소장 가치가 충분한 마스터피스입니다.`,
                review: `가격대가 있어서 고민했는데 받아보니 납득이 가네요. 퀄리티가 확실히 다릅니다.`
            },
            {
                desc: `자연스러운 멋을 추구하는 분들을 위한 ${category} 컬렉션입니다. 린넨과 코튼 혼방으로 통기성이 우수하여 쾌적하며, 내추럴한 구김조차 멋스럽게 연출됩니다.`,
                review: `시원하고 편안해요. 꾸민 듯 안 꾸민 듯 자연스러운 멋이 나서 좋아요.`
            }
        ];

        const randomTemplate = FALLBACK_TEMPLATES[index % FALLBACK_TEMPLATES.length];

        // Fallback content - with diverse templates
        return {
            productName: `프리미엄 ${itemType} ${String.fromCharCode(65 + (index % 5))}`, // A, B, C... suffix for variety
            description: randomTemplate.desc,
            review: randomTemplate.review,
            rating: 4 + (index % 2), // 4 or 5
            brand: 'N-D Atelier',
            materials: ['프리미엄 소재'],
            techniques: ['핸드메이드', '친환경 염료']
        };
    }
}

/**
 * text-embedding-004로 텍스트 벡터화
 */
async function getEmbedding(text) {
    try {
        const response = await fetch(EMBEDDING_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'models/text-embedding-004',
                content: { parts: [{ text }] }
            })
        });

        if (!response.ok) {
            throw new Error(`Embedding API error: ${response.status}`);
        }

        const data = await response.json();
        return data.embedding?.values || null;
    } catch (error) {
        console.error('Error getting embedding:', error.message);
        return null;
    }
}

/**
 * Supabase에 데이터 저장
 */
async function saveToSupabase(content, metadata, embedding) {
    const { data, error } = await supabase
        .from('product_contents')
        .insert({
            content,
            metadata,
            embedding
        })
        .select('id');

    if (error) {
        console.error('Supabase insert error:', error.message);
        return null;
    }

    return data?.[0]?.id;
}

/**
 * Rate limiting을 위한 delay
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry with exponential backoff for 429 errors
 */
async function retryWithBackoff(fn, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (error.message?.includes('429') && i < maxRetries - 1) {
                const waitTime = Math.pow(2, i + 1) * 1000; // 2s, 4s, 8s
                console.log(`    ⏳ Rate limit hit, waiting ${waitTime / 1000}s...`);
                await delay(waitTime);
            } else {
                throw error;
            }
        }
    }
}

/**
 * Main execution
 */
async function main() {
    console.log('🚀 Product Contents Seed Script 시작\n');
    console.log(`📊 목표: 50개 상품 콘텐츠 생성 및 저장\n`);

    // 기존 데이터 삭제
    await clearExistingData();

    let successCount = 0;
    let errorCount = 0;
    let contentIndex = 1;

    // 각 카테고리에서 균등하게 10개씩 생성 (5 카테고리 x 10 = 50)
    for (const category of CATEGORIES) {
        console.log(`\n📁 카테고리: ${category.name}`);

        // 각 카테고리당 10개 (아이템 종류를 순환)
        for (let i = 0; i < 10; i++) {
            const itemType = category.items[i % category.items.length];

            console.log(`  [${contentIndex}/50] ${itemType} 생성 중...`);

            // 1. Gemini로 콘텐츠 생성 (실패 시 fallback 사용)
            // 텍스트 생성에서 429 발생해도 fallback content로 진행
            const productData = await generateProductContent(category.name, itemType, contentIndex);

            // 5초 대기 (Gemini 생성 후)
            console.log(`    ⏳ Rate limiting: 5초 대기...`);
            await delay(5000);

            // 2. 임베딩할 텍스트 조합 (상품명 + 설명 + 리뷰)
            const fullContent = `${productData.productName}\n\n${productData.description}\n\n리뷰: ${productData.review}`;

            // 3. 임베딩 생성 (text-embedding-004는 별도 할당량)
            // 이미 생성된 콘텐츠는 임베딩만 하면 됨
            const embedding = await getEmbedding(fullContent);

            if (!embedding) {
                console.log(`    ⚠️ 임베딩 실패, 스킵`);
                errorCount++;
                contentIndex++;
                continue;
            }

            // 4. 메타데이터 구성
            const metadata = {
                category: category.name,
                type: itemType,
                productName: productData.productName,
                brand: productData.brand,
                rating: productData.rating,
                materials: productData.materials || [],
                techniques: productData.techniques || [],
                contentType: i % 2 === 0 ? 'description' : 'review'
            };

            // 5. Supabase 저장
            const savedId = await saveToSupabase(fullContent, metadata, embedding);

            if (savedId) {
                const shortId = typeof savedId === 'string' ? savedId.slice(0, 8) : savedId;
                console.log(`    ✅ 저장 완료 (ID: ${shortId}...)`);
                successCount++;
            } else {
                console.log(`    ❌ 저장 실패`);
                errorCount++;
            }

            contentIndex++;

            // 추가 대기 (총 5~6초 간격)
            await delay(1000);
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`📊 결과 요약`);
    console.log(`   성공: ${successCount}개`);
    console.log(`   실패: ${errorCount}개`);
    console.log('='.repeat(50));

    console.log('\n✨ Seed Script 완료!');
    console.log('\n📝 검증 쿼리 (Supabase SQL Editor에서 실행):');
    console.log('   SELECT COUNT(*) FROM product_contents;');
    console.log('   SELECT id, metadata->>\'category\' as category, LEFT(content, 50) FROM product_contents LIMIT 5;');
}

main().catch(console.error);

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// .env.local 파일 로드
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('필요한 환경 변수가 누락되었습니다.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function registerProduct() {
    const productData = {
        content: `삼성전자 하만카돈 오라스튜디오4(Harman Kardon Aura Studio 4) 블루투스 스피커 조명 무드등 감성 선물용 블랙. 360도 고음질 사운드와 5가지 조명 테마의 앰비언트 라이팅을 제공합니다. 130mm 다운 파이어링 서브우퍼 탑재로 강력한 저음을 자랑하며, 패브릭 재활용 소재를 활용한 친환경 디자인입니다. 가격: 252,000원. 라이프스타일 테크 음향기기 스피커 추천`,
        metadata: {
            category: "라이프스타일",
            type: "음향기기",
            productName: "하만카돈 오라스튜디오4 스피커",
            brand: "Harman Kardon",
            rating: 5.0,
            price: 252000,
            imageUrl: "https://shop-phinf.pstatic.net/20240927_285/1727413448194FH5K8_PNG/3781039314630814_1900004431.png?type=m120",
            features: ["360도 고음질 사운드", "5가지 조명 테마", "130mm 서브우퍼", "재활용 소재"]
        }
    };

    console.log('상품 정보 등록 중...');
    const { data, error } = await supabase
        .from('product_contents')
        .insert([productData])
        .select();

    if (error) {
        console.error('등록 실패:', error.message);
    } else {
        console.log('등록 성공:', data);
    }
}

registerProduct();

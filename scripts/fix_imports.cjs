const fs = require('fs');
const path = require('path');

const TYPE_REPLACEMENTS = {
    'Product': '@/utils/dummyData',
    'CartItem': '@/utils/dummyData',
    'Order': '@/utils/orderStorage',
    'Review': '@/utils/boardStorage',
    'ProductInquiry': '@/utils/boardStorage',
    'OneToOneInquiry': '@/utils/boardStorage',
    'Notice': '@/utils/boardStorage',
    'FAQ': '@/utils/boardStorage',
    'AdminUser': '@/utils/userStorage',
    'User': '@/utils/userStorage'
};

function fixImports(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    for (const [typeName, oldPath] of Object.entries(TYPE_REPLACEMENTS)) {
        const pattern = new RegExp(`import\\s+\\{([^}]+)\\}\\s+from\\s+["']${oldPath.replace('@', '@')}["']`, 'g');

        content = content.replace(pattern, (match, p1) => {
            let names = p1.split(',').map(n => n.trim());
            if (names.includes(typeName)) {
                modified = true;
                names = names.filter(n => n !== typeName);

                let replacement = '';
                if (names.length > 0) {
                    replacement += `import { ${names.join(', ')} } from "${oldPath}";\n`;
                }

                // Check for existing @/types import
                const typesPattern = /import\s+\{([^}]+)\}\s+from\s+["']@\/types["']/;
                const typesMatch = content.match(typesPattern);
                if (typesMatch) {
                    let typeNames = typesMatch[1].split(',').map(n => n.trim());
                    if (!typeNames.includes(typeName)) {
                        typeNames.push(typeName);
                        content = content.replace(typesMatch[0], `import { ${typeNames.join(', ')} } from "@/types"`);
                    }
                } else {
                    const insertionPoint = content.includes("'use client'") ? content.indexOf("'use client'") + 12 : 0;
                    content = content.slice(0, insertionPoint) + `\nimport { ${typeName} } from "@/types";` + content.slice(insertionPoint);
                }

                return replacement.trim();
            }
            return match;
        });
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        return true;
    }
    return false;
}

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            if (fixImports(fullPath)) {
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

walk('c:/Users/User/workspace/shopping_mall/app');
walk('c:/Users/User/workspace/shopping_mall/components');

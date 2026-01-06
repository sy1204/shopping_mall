import os
import re

# Precise mapping of types to their previous home
TYPE_REPLACEMENTS = {
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
}

def fix_imports(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    
    # 1. Check for imports like: import { A, B } from 'path'
    # and split them if some should go to @/types
    
    # This is complex, let's try a simpler approach:
    # If a file imports a TYPE from a STORAGE, we want to add an import from @/types 
    # and remove it from the STORAGE import.

    modified = False
    
    for type_name, old_path in TYPE_REPLACEMENTS.items():
        # Match pattern: import { ..., type_name, ... } from 'old_path'
        pattern = re.compile(r'import\s+\{([^}]+)\}\s+from\s+["\']' + re.escape(old_path) + r'["\']')
        match = pattern.search(content)
        
        if match:
            names = [n.strip() for n in match.group(1).split(',')]
            if type_name in names:
                # Remove from current names
                names.remove(type_name)
                
                # If names still has elements, keep the storage import
                if names:
                    new_storage_import = f'import {{ {", ".join(names)} }} from "{old_path}";'
                    content = content.replace(match.group(0), new_storage_import)
                else:
                    # Remove the whole line
                    content = content.replace(match.group(0), '')
                
                # Add or update @/types import
                types_pattern = re.compile(r'import\s+\{([^}]+)\}\s+from\s+["\']@/types["\']')
                types_match = types_pattern.search(content)
                if types_match:
                    type_names = [n.strip() for n in types_match.group(1).split(',')]
                    if type_name not in type_names:
                        type_names.append(type_name)
                        new_types_import = f'import {{ {", ".join(type_names)} }} from "@/types";'
                        content = content.replace(types_match.group(0), new_types_import)
                else:
                    # Insert after 'use client' or at top
                    insertion_point = 0
                    if "'use client'" in content:
                        insertion_point = content.find("'use client'") + 12
                    elif '"use client"' in content:
                        insertion_point = content.find('"use client"') + 12
                    
                    content = content[:insertion_point] + f'\nimport {{ {type_name} }} from "@/types";' + content[insertion_point:]
                
                modified = True

    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

# Walk through project
root_dir = 'c:/Users/User/workspace/shopping_mall/app'
count = 0
for subdir, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            if fix_imports(os.path.join(subdir, file)):
                count += 1

root_dir = 'c:/Users/User/workspace/shopping_mall/components'
for subdir, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            if fix_imports(os.path.join(subdir, file)):
                count += 1

print(f"Updated {count} files.")

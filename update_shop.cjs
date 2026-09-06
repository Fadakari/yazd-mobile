const fs = require('fs');
const path = './src/services/shopActions.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'interface GetProductsParams {',
  'interface GetProductsParams {\n    brand_id?: number;'
);

content = content.replace(
  'if (searchParams?.category_id !== undefined) query.append("category_id", searchParams.category_id.toString());',
  'if (searchParams?.category_id !== undefined) query.append("category_id", searchParams.category_id.toString());\n        if (searchParams?.brand_id !== undefined) query.append("brand_id", searchParams.brand_id.toString());'
);

const getBrandsFunc = `
export async function GetBrands() {
    try {
        const res = await fetch(\`\${process.env.NEXT_PUBLIC_API_URL}/shop/brands/\`, {
            ...getFetchOptions(),
            next: { revalidate: 30 }
        });
        if (!res.ok) return [];
        return await res.json();
    } catch (error) {
        console.error("GetBrands:", error);
        return [];
    }
}
`;

content += getBrandsFunc;
fs.writeFileSync(path, content, 'utf8');

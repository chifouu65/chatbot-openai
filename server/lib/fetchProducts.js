
const fetchProducts = async () => {
    const response = await fetch('https://api.pierrette-essentielle.com/api//products?populate=*&[filters][categories][id]=2&[filters][price][$lte]=200&sort=price'
    ,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'bearer 4dcc75be011d7d3b82cd71c8219728b6cac10d3987b40ae8c6e84a4743de3b4918ee4980535d9c582b5e1d8400df88f9946204668a912724031c1ba0553a8a9e40c48296be4f8205bfa17449c03d2bfb271accca12871b316d968b9fe71733fba773c96549c6ea70c347c077e8c1abcf20a76b3e1073fdd3f4c71c6dfbdd0ac3'
            }
        }
    ).then((response) => {
        return response.json();
    }).catch((error) => {
        console.log(error);
    });
    const products = response.data;
    console.log(products);
    return products;
}

export default fetchProducts;

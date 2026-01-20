// data/menu.ts
export const menuData = {
    coffee: [
      { id: 1, name: 'Americano', price: 8000, description: 'Kopi hitam klasik yang segar.', popular: false, image: '/Americano-removebg-preview.png' },
      { id: 2, name: 'Coffee Latte', price: 10000, description: 'Perpaduan espresso dengan susu lembut.', popular: true, image: '/ice_cafe_late-removebg-preview.png' },
      { id: 3, name: 'Kopi Susu Tersenyum', price: 11000, description: 'Kopi susu khas Tersenyum Coffee.', popular: true, image: '/kopi-susu-tersenyum.jpg' },
      { id: 4, name: 'Kopi Gula Aren', price: 12000, description: 'Kopi susu dengan manisnya gula aren asli.', popular: false, image: '/kopi-gula-aren.jpg' },
      { id: 5, name: 'Salted Caramel', price: 13000, description: 'Kopi dengan sensasi gurih dan manis karamel.', popular: true, image: '/salted-caramel.jpg' },
      { id: 6, name: 'Butterscotch', price: 13000, description: 'Kopi dengan aroma butterscotch yang creamy.', popular: false, image: '/butterscotch.jpg' },
      { id: 7, name: 'Mochacino', price: 13000, description: 'Perpaduan cokelat dan kopi yang nikmat.', popular: false, image: '/mochacino.jpg' },
      { id: 8, name: 'Hazelnut Latte', price: 13000, description: 'Latte dengan aroma kacang hazelnut.', popular: false, image: '/hazelnut-latte.jpg' },
      { id: 9, name: 'Vanilla Latte', price: 13000, description: 'Latte dengan sentuhan rasa vanilla.', popular: false, image: '/vanilla-latte.jpg' },
      { id: 10, name: 'Spanish Latte', price: 13000, description: 'Kopi susu ala Spanyol yang lebih manis.', popular: false, image: '/spanish-latte.jpg' },
      { id: 11, name: 'Coconut Latte', price: 15000, description: 'Latte unik dengan campuran kelapa.', popular: false, image: '/coconut-latte.jpg' },
    ],
    'non-coffee': [
      { id: 12, name: 'Chocolate', price: 13000, description: 'Minuman cokelat premium yang pekat.', popular: true, image: '/chocolate.jpg' },
      { id: 13, name: 'Matcha Kalem', price: 13000, description: 'Teh hijau jepang yang menenangkan.', popular: true, image: '/matcha-kalem.jpg' },
      { id: 14, name: 'Red Velvet', price: 13000, description: 'Minuman red velvet yang manis dan lembut.', popular: false, image: '/red-velvet.jpg' },
      { id: 15, name: 'Leci Tea', price: 10000, description: 'Teh rasa leci yang menyegarkan.', popular: false, image: '/leci-tea.jpg' },
      { id: 16, name: 'Mango Tea', price: 10000, description: 'Teh rasa mangga yang manis segar.', popular: false, image: '/mango-tea.jpg' },
    ],
    snack: [
      { id: 17, name: 'Cireng', price: 10000, description: 'Camilan tradisional yang gurih dan kenyal.', popular: true, image: '/cireng.jpg' },
      { id: 18, name: 'Kentang', price: 12000, description: 'Kentang goreng renyah.', popular: false, image: '/kentang.jpg' },
      { id: 19, name: 'Mix Platter', price: 15000, description: 'Kombinasi berbagai macam camilan.', popular: true, image: '/mix-platter.jpg' },
      { id: 20, name: 'Nugget', price: 12000, description: 'Nugget ayam goreng lezat.', popular: false, image: '/nugget.jpg' },
    ],
  };

// Fungsi pembantu untuk mencari item berdasarkan ID
export const getMenuItemById = (id: number) => {
  const allItems = [...menuData.coffee, ...menuData['non-coffee'], ...menuData.snack];
  return allItems.find(item => item.id === id);
};
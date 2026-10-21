const books = [
  { id: 'gatsby', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', tag: 'Classic', category: 'Fiction', price: 16.0, isbn: '9780743273565' },
  { id: 'beloved', title: 'Beloved', author: 'Toni Morrison', tag: 'Literary Fiction', category: 'Fiction', price: 17.95, isbn: '9781400033416' },
  { id: 'circe', title: 'Circe', author: 'Madeline Miller', tag: 'Myth & Fantasy', category: 'Fiction', price: 18.99, isbn: '9780316556347' },
  { id: 'station-eleven', title: 'Station Eleven', author: 'Emily St. John Mandel', tag: 'Speculative Fiction', category: 'Fiction', price: 16.95, isbn: '9780385353304' },
  { id: 'educated', title: 'Educated', author: 'Tara Westover', tag: 'Memoir', category: 'Nonfiction', price: 18.0, isbn: '9780399590504' },
  { id: 'sapiens', title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', tag: 'History', category: 'Nonfiction', price: 22.99, isbn: '9780062316097' },
  { id: 'sweetgrass', title: 'Braiding Sweetgrass', author: 'Robin Wall Kimmerer', tag: 'Science & Nature', category: 'Nonfiction', price: 20.0, isbn: '9781571313560' },
  { id: 'atomic-habits', title: 'Atomic Habits', author: 'James Clear', tag: 'Personal Development', category: 'Nonfiction', price: 27.0, isbn: '9780735211292' },
  {
    id: 'piranesi', title: 'Piranesi', author: 'Susanna Clarke', tag: 'Fantasy', category: 'Fiction', price: 17.99, isbn: '9781635575637',
    staffPick: { quote: 'A strange, tender puzzle box of a book. I finished it in one sitting and started again the next day.', by: 'Maya, Fiction buyer' },
  },
  {
    id: 'remains-of-the-day', title: 'The Remains of the Day', author: 'Kazuo Ishiguro', tag: 'Literary Fiction', category: 'Fiction', price: 17.0, isbn: '9780679731726',
    staffPick: { quote: 'Quiet and devastating. The most elegant study of regret I have ever read.', by: 'Tom, Shop manager' },
  },
  {
    id: 'gentleman-in-moscow', title: 'A Gentleman in Moscow', author: 'Amor Towles', tag: 'Historical Fiction', category: 'Fiction', price: 19.0, isbn: '9780670026197',
    staffPick: { quote: "Charming, witty and humane. Our go-to gift for anyone who says they don't have time to read.", by: 'Priya, Events lead' },
  },
  {
    id: 'pachinko', title: 'Pachinko', author: 'Min Jin Lee', tag: 'Family Saga', category: 'Fiction', price: 18.99, isbn: '9781455563937',
    staffPick: { quote: 'A sweeping family saga that earns every page. Bring tissues and clear your weekend.', by: 'Sam, Bookseller' },
  },
]

export default books

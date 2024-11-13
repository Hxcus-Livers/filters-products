const url = 'https://www.course-api.com/javascript-store-products';

const productsDOM = document.querySelector('.products-center');

let productsData = [];
const searchInput = document.querySelector('.search-input');
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = themeToggle.querySelector('i');

const cart = JSON.parse(localStorage.getItem('cart')) || [];
console.log('Current Cart:', cart);

const fetchProducts = async () => {
  productsDOM.innerHTML = '<div class="loading"></div>';
  try {
    const resp = await fetch(url);
    const data = await resp.json();
    return data;
  } catch (error) {
    productsDOM.innerHTML = '<p class="error">there was an error</p>';
  }
};

const displayProducts = (list) => {
  const productList = list
    .map((product) => {
      const { id } = product;
      const { name: title, price } = product.fields;
      const { url: img } = product.fields.image[0];
      const formatPrice = price / 100;
      // id,name,price,img
      return `<a class="single-product" href="product.html?id=${id}&name=john&age=25">
            <img src="${img}" class="single-product-img img" alt="${title}" />
            <footer>
              <h5 class="name">${title}</h5>
              <span class="price">$${formatPrice}</span>
            </footer>
          </a>`;
    })
    .join('');
  productsDOM.innerHTML = ` <div class="products-container">
         ${productList}
          
        </div>`;
};

// Add new function to filter products
const setupCompanies = (data) => {
  const companies = ['all', ...new Set(data.map((item) => item.fields.company))];
  const companiesDOM = document.querySelector('.companies');
  companiesDOM.innerHTML = companies
    .map((company) => {
      return `<button class="company-btn ${
        company === 'all' ? 'active' : ''
      }" data-company="${company}">${company}</button>`;
    })
    .join('');

  // Add click event listeners
  companiesDOM.addEventListener('click', (e) => {
    const el = e.target;
    if (el.classList.contains('company-btn')) {
      let filterProducts;
      const searchTerm = searchInput.value.toLowerCase();
      
      // First filter by company
      if (el.dataset.company === 'all') {
        filterProducts = [...productsData];
      } else {
        filterProducts = productsData.filter(
          (product) => product.fields.company === el.dataset.company
        );
      }
      
      // Then apply search filter
      if (searchTerm) {
        filterProducts = filterProducts.filter((product) => {
          const { name } = product.fields;
          return name.toLowerCase().includes(searchTerm);
        });
      }
      
      // Update active button
      document.querySelectorAll('.company-btn').forEach((btn) => {
        btn.classList.remove('active');
      });
      el.classList.add('active');
      
      // Display filtered products
      displayProducts(filterProducts);
    }
  });
};

// Add theme toggle functionality
const toggleTheme = () => {
  document.body.classList.toggle('dark-theme');
  if (document.body.classList.contains('dark-theme')) {
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
    localStorage.setItem('theme', 'dark');
  } else {
    themeIcon.classList.add('fa-sun');
    themeIcon.classList.remove('fa-moon');
    localStorage.setItem('theme', 'light');
  }
};

// Check for saved theme
const checkTheme = () => {
  const theme = localStorage.getItem('theme') || 'light';
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
  }
};

// Add search functionality
const setupSearch = (data) => {
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = data.filter((product) => {
      const { name } = product.fields;
      return name.toLowerCase().includes(searchTerm);
    });
    displayProducts(filteredProducts);
  });
};

// Modify the start function
const start = async () => {
  productsData = await fetchProducts();
  displayProducts(productsData);
  setupCompanies(productsData);
  setupSearch(productsData);
  checkTheme();
};

// Add event listeners
themeToggle.addEventListener('click', toggleTheme);

// Start the app
start();

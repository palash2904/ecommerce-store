import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Product } from '../../models/store.models';
import { CartService } from '../../services/cart.service';
import { ProductDataService } from '../../services/product-data.service';

interface ShowcaseCard {
  title: string;
  price: string;
  seller: string;
  badge?: string;
}

@Component({
  selector: 'app-main',
  imports: [FormsModule, RouterLink, DecimalPipe],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  categories: string[] = [];
  allProducts: Product[] = [];
  visibleProducts: Product[] = [];

  selectedCategory = 'All';
  selectedShopTile = 'Technology';
  mobileShopCategory = 'Technology';
  selectedTechTab = 'All';
  selectedWatchTab = 'All';
  selectedCosmeticTab = 'All';
  selectedRealEstateTab = 'All';
  selectedLuxuryFoodTab = 'All';
  searchTerm = '';
  cartCount = 0;
  mobileMenuOpen = false;

  promoProducts: Product[] = [];
  sidebarProducts: Product[] = [];

  readonly categoryTiles = [
    { name: 'Real Estate', icon: 'img/products/real-estate.svg', filter: 'Home' },
    { name: 'Technology', icon: 'img/products/technology.svg', filter: 'Electronics' },
    { name: 'Watch', icon: 'img/products/watch.svg', filter: 'Fashion' },
    { name: 'Glasses', icon: 'img/products/glasses.svg', filter: 'Fashion' },
    { name: 'Cosmetic', icon: 'img/products/cosmetic.svg', filter: 'Beauty' },
    { name: 'Food High Grade', icon: 'img/products/_drink.svg', filter: 'Home' }
  ];
  readonly productBadges = ['New', 'Favorite', '- 15%', 'Sold Out', '', ''];
  readonly techTabs = ['All', 'Smart Watch', 'Laptop', 'Tablet', 'Desktop', 'Accessories'];
  readonly watchTabs = ['All', "Men's watch", "Women's Watches", 'Smart watch'];
  readonly cosmeticTabs = ['All', 'Lotion', 'Mask', 'Perfume'];
  readonly realEstateTabs = ['All', 'House', 'Land', 'House for rent', 'Land for rent', 'Project'];
  readonly luxuryFoodTabs = ['All', 'Drinks - Preparation', 'Cereals', 'Drink', 'Resources'];
  readonly sectionProducts: Record<string, ShowcaseCard[]> = {
    Technology: [
      { title: 'Apple Macbook Pro 2019 MWP42SA/A', price: '$2,013.54', seller: 'by Co., Ltd Minie Li', badge: 'New' },
      { title: 'Apple Watch Series 5 MWV62VN/A', price: '$517.79', seller: 'by 247 Store', badge: 'Favorite' },
      { title: 'Apple Macbook Air MWTJ2SA/A Space Grey (2020)', price: '$1,099', seller: 'by Kimpine Calculator', badge: '- 15%' },
      { title: 'Apple Watch Series 5 MWV62VN/A', price: '$193.31', seller: 'by Kimpine Calculator', badge: 'Sold Out' },
      { title: 'Logitech B175 wireless office mouse', price: '$15.86', seller: 'by Co., Ltd Minie Li' },
      { title: 'Apple Macbook Pro 2019 MWP42SA/A', price: '$2,013.54', seller: 'by Co., Ltd Flower In' }
    ],
    Watch: [
      { title: 'Apple Watch Series 5 MWV62VN/A', price: '$514.51', seller: 'by Co., Ltd Minie Li', badge: '- 49%' },
      { title: 'Hand Watch Rossini - 1328W01A', price: '$146.71', seller: 'by Co., Ltd SMART MARKETING', badge: '- 12%' },
      { title: 'Hand Watch Rossini - 5395T01G', price: '$183.64', seller: 'by Co., Ltd Minie Li', badge: '- 5%' },
      { title: 'Hand Watch Swiss Alpine Military - 32391537', price: '$215.31', seller: 'by Co., Ltd SMART MARKETING', badge: 'New' },
      { title: 'Watch For Man Larmes LM-TF004 0T49G 211 4NB - Optimus Prime', price: '$73.01', seller: 'by Mobile World', badge: 'New' },
      { title: 'Hand Watch For Man Citizen BI5000-87L', price: '$66.79', seller: 'by Co., Ltd Minie Li' }
    ],
    Cosmetics: [
      { title: 'CIC2 Skin Decode Kit', price: '$690.38', seller: 'by Co., LTD Baby Girl', badge: 'New' },
      { title: 'Angel Whitening Treament Lotion', price: '$132.90', seller: 'by Co., Ltd Beautyful Face', badge: 'Favorite' },
      { title: 'Sunscreen moisturizing intensify', price: '$69.04', seller: 'by Co., LTD Baby Girl', badge: 'Sold Out' },
      { title: 'Anti-allergy serum', price: '$132.90', seller: 'by Co., Ltd Byware Cosmetic' }
    ],
    'Real Estate': [
      { title: 'Apartment for rent in GELA CENTRAL PARK 1,2,3,4 PN and LAND 72', price: '$2500 /month', seller: 'by Flower Real Estate', badge: 'New' },
      { title: 'For Rent DALA GOLDEN RIVER (Ba Son) District 1', price: 'Price Agreement', seller: 'by Vanegroup', badge: 'Watch a lot' },
      { title: 'Apartment for rent in DIAMOND', price: '$4505 /month', seller: 'by Flower Real Estate', badge: 'Deal' },
      { title: 'Apartment for rent in District 10, Ha Do CENTROSA GARDEN', price: '$517.79 /month', seller: 'by 247 REAL ESTATE', badge: 'Ordered' }
    ],
    'Luxury Food': [
      { title: 'Fujiwa alkaline ion drink 1250ml - Barrel of 12 bottles', price: '$32', seller: 'by Co., Ltd FUJIWA USA', badge: 'New' },
      { title: 'Fujiwa alkaline drinking water in 4 bottles of 5L (with faucet)', price: '$2300', seller: 'by Co., Ltd FUJIWA USA', badge: 'New' },
      { title: 'Pure Kinh Mon Tapioca Flour WATAPY', price: '$58', seller: 'by Gesan Investment Joint Stock Company' },
      { title: 'Oak Wine', price: '$517.79', seller: 'by Gesan Investment Joint Stock Company' }
    ]
  };

  constructor(
    private productDataService: ProductDataService,
    private cartService: CartService,
    private toastr: NzMessageService
  ) { }

  ngOnInit(): void {
    this.productDataService.getStoreData().subscribe((data) => {
      this.categories = data.categories;
      this.allProducts = data.products;
      this.applyFilters();
    });

    this.cartService.cartItems$.subscribe((items) => {
      this.cartCount = items.reduce((total, item) => total + item.quantity, 0);
    });
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    const selectedTile = this.categoryTiles.find((tile) => tile.filter === category);
    if (selectedTile) {
      this.selectedShopTile = selectedTile.name;
      this.mobileShopCategory = selectedTile.name;
    }
    this.applyFilters();
    this.mobileMenuOpen = false;
  }

  selectShopCategory(tileName: string, category: string): void {
    this.selectedShopTile = tileName;
    this.mobileShopCategory = tileName;
    this.selectedCategory = category;
    this.applyFilters();
  }

  onMobileShopCategoryChange(): void {
    const selectedTile = this.categoryTiles.find((tile) => tile.name === this.mobileShopCategory);
    if (!selectedTile) {
      return;
    }
    this.selectShopCategory(selectedTile.name, selectedTile.filter);
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  addToCart(product: Product): void {
    if (!product) {
      this.toastr.warning('Product is not available right now.');
      return;
    }

    this.cartService.addToCart(product);
    this.toastr.success(`${product.name} added to cart`);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  getSectionProducts(category: string): Product[] {
    const source = this.searchTerm.trim() ? this.visibleProducts : this.allProducts;
    return source.filter((product) => category === 'All' || product.category === category).slice(0, 4);
  }

  get categoryShowcaseCards(): ShowcaseCard[] {
    const query = this.searchTerm.trim().toLowerCase();
    const selectedSection = this.getSelectedSectionByTile();

    if (!query) {
      return this.sectionProducts[selectedSection] || [];
    }

    const allSectionCards = Object.values(this.sectionProducts).flat();
    return allSectionCards.filter((card) =>
      card.title.toLowerCase().includes(query) ||
      card.seller.toLowerCase().includes(query) ||
      (card.badge || '').toLowerCase().includes(query)
    );
  }

  get categoryEmptyMessage(): string {
    if (this.selectedShopTile === 'Glasses') {
      return 'No products available in Glasses category.';
    }
    return 'No products found.';
  }

  private getSelectedSectionByTile(): string {
    const sectionByTile: Record<string, string> = {
      'Real Estate': 'Real Estate',
      Technology: 'Technology',
      Watch: 'Watch',
      Cosmetic: 'Cosmetics',
      Food: 'Luxury Food'
    };

    return sectionByTile[this.selectedShopTile] || 'Technology';
  }

  get promoDisplayProducts(): Product[] {
    const source = this.searchTerm.trim() ? this.visibleProducts : this.allProducts;
    return source.slice(0, 2);
  }

  getLoopedProducts(count: number, offset = 0): Product[] {
    const source = this.searchTerm.trim() ? this.visibleProducts : this.allProducts;
    if (!source.length) {
      return [];
    }

    return Array.from({ length: count }, (_, index) => source[(offset + index) % source.length]);
  }

  getSectionBadge(section: 'tech' | 'watch' | 'cosmetic', index: number): string {
    const map: Record<'tech' | 'watch' | 'cosmetic', string[]> = {
      tech: ['New', 'Favorite', '- 15%', '', 'Sold Out', '', '', ''],
      watch: ['- 49%', '- 12%', '- 5%', 'New', 'New', ''],
      cosmetic: ['New', 'Favorite', 'Sold Out', '']
    };

    return map[section][index] || '';
  }

  private applyFilters(): void {
    const normalizedQuery = this.searchTerm.trim().toLowerCase();

    this.visibleProducts = this.allProducts.filter((product) => {
      const matchesCategory =
        this.selectedCategory === 'All' || product.category === this.selectedCategory;

      const matchesSearch =
        normalizedQuery.length === 0 ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });

    this.promoProducts = this.visibleProducts.slice(0, 3);
    this.sidebarProducts = this.visibleProducts.slice(0, 6);
  }


}

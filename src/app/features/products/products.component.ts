import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith, tap } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { NotificationService } from '../../core/services/notification.service';
import { FinancialProduct } from '../../core/models/financial-product.model';
import { DefaultImageDirective } from '../../core/directives/default-image';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  imports: [ReactiveFormsModule, DatePipe, RouterLink, ModalComponent, DefaultImageDirective],
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private notificationService = inject(NotificationService);

  products = signal<FinancialProduct[]>([]);
  isLoading = signal<boolean>(true);

  currentPage = signal<number>(1);
  pageSize = signal<number>(this.getStoredPageSize());
  pageSizeOptions = [5, 10, 20];

  activeMenuId = signal<string | null>(null);
  showDeleteModal = signal<boolean>(false);
  productToDelete = signal<FinancialProduct | null>(null);

  searchControl = new FormControl('', { nonNullable: true });
  searchTerm = toSignal(
    this.searchControl.valueChanges.pipe(
      startWith(''),
      tap(() => this.currentPage.set(1))
    ),
    { initialValue: '' }
  );

  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const products = this.products();
    
    if (!term) return products;
    
    return products.filter((p) => 
      p.name.toLowerCase().includes(term) || 
      p.description.toLowerCase().includes(term)
    );
  });

  paginatedProducts = computed(() => {
    const products = this.filteredProducts();
    const page = this.currentPage();
    const size = this.pageSize();

    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;

    return products.slice(startIndex, endIndex);
  });

  totalItems = computed(() => this.filteredProducts().length);
  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading.set(true);
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }

  private getStoredPageSize(): number {
    const stored = localStorage.getItem('pageSize');
    return stored ? parseInt(stored, 10) : 5;
  }

  onPageSizeChange(event: Event) {
    const newSize = parseInt((event.target as HTMLSelectElement).value, 10);
    this.pageSize.set(newSize);
    localStorage.setItem('pageSize', newSize.toString());
    this.currentPage.set(1);
  }

  toggleMenu(id: string) {
    this.activeMenuId.update((currentId) => (currentId === id ? null : id));
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
    }
  }

  confirmDelete(product: FinancialProduct) {
    this.productToDelete.set(product);
    this.showDeleteModal.set(true);
    this.activeMenuId.set(null);
  }

  cancelDelete() {
    this.showDeleteModal.set(false);
    this.productToDelete.set(null);
  }

  deleteProduct() {
    const product = this.productToDelete();
    if (!product) return;

    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Producto eliminado correctamente');
        this.loadProducts();
        this.cancelDelete();
      },
      error: (err) => {
        console.error(err);
        this.notificationService.showError('Error al eliminar el producto');
        this.cancelDelete();
      },
    });
  }
}

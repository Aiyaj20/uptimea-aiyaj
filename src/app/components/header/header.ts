import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ApiServices } from '../../services/api-services';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  user!: any;
  loading = true;

  constructor(private api: ApiServices) { }


  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  showSearchMobile = false;

  toggleSearchMobile() {
    this.showSearchMobile = !this.showSearchMobile;
  }
  navItems = [
    { label: 'Overview' },
    { label: 'Repositories', badge: 25 },
    { label: 'Projects' },
    { label: 'Packages' },
    { label: 'Stars', badge: 5 }
  ];

  visibleItems: any[] = [...this.navItems];
  hiddenItems: any[] = [];
  activeItem: string = 'Overview';

  @ViewChild('navList') navList!: ElementRef<HTMLUListElement>;

  ngOnInit() {
    this.updateVisibleItems();
    this.api.getUser('shreeramk').subscribe(res => {
      this.user = res;
      this.loading = false;
    });
  }

  setActive(item: any) {
    this.activeItem = item.label;
  }

  @HostListener('window:resize')
  onResize() {
    this.updateVisibleItems();
  }

  updateVisibleItems() {
    if (!this.navList) return;

    const containerWidth = this.navList.nativeElement.offsetWidth;
    let totalWidth = 0;
    const tempVisible: any[] = [];
    const tempHidden: any[] = [];

    const temp = document.createElement('li');
    temp.style.visibility = 'hidden';
    temp.style.position = 'absolute';
    this.navList.nativeElement.appendChild(temp);

    for (const item of this.navItems) {
      temp.innerHTML = `<a class="nav-link">${item.label}${item.badge ? ' <span class="badge bg-light text-dark">' + item.badge + '</span>' : ''}</a>`;
      const itemWidth = temp.offsetWidth + 16;

      if (totalWidth + itemWidth < containerWidth) {
        tempVisible.push(item);
        totalWidth += itemWidth;
      } else {
        tempHidden.push(item);
      }
    }

    this.visibleItems = tempVisible;
    this.hiddenItems = tempHidden;

    this.navList.nativeElement.removeChild(temp);
  }

  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectHiddenItem(item: any) {
    this.setActive(item);
    this.isDropdownOpen = false; // close after selection
  }

}

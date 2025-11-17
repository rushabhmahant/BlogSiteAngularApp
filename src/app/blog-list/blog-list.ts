import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { BlogService, Blog } from '../services/blog-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-blog-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './blog-list.html',
  styleUrl: './blog-list.css',
})
export class BlogList implements OnInit {

  blogs: Blog[] = [];
  filteredBlogs: Blog[] = [];
  isLoading = signal(true);
  errorMessage: string = '';
  userId: number = 0;
  searchQuery: string = '';
  fromDate: string = '';
  toDate: string = '';

  constructor(private blogService: BlogService,
    private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    // Check if user is logged in
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      // Redirect to login if not authenticated
      this.router.navigate(['/login']);
      return;
    }

    // Get userId from route parameters
    this.activatedRoute.paramMap.subscribe(params => {
      const userIdParam = params.get('userId');
      console.log('Route params:', params);
      console.log('userId param:', userIdParam);
      
      if (userIdParam) {
        this.userId = Number(userIdParam);
        console.log('Parsed userId:', this.userId);
        this.loadBlogs();
      } else {
        // Use stored userId
        this.userId = Number(storedUserId);
        console.log('Using stored userId:', this.userId);
        this.loadBlogs();
      }
    });
  }

  loadBlogs(): void {
    if (!this.userId || this.userId === 0) {
      this.errorMessage = 'Invalid user ID. Please log in again.';
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);
    this.errorMessage = '';

    console.log('Loading blogs for userId:', this.userId);

    this.blogService.getBlogsByUserId(this.userId).subscribe({
      next: (data) => {
        this.blogs = data;
        this.filteredBlogs = data;
        this.isLoading.set(false);
        console.log('Blogs loaded successfully:', data);
        console.log('Number of blogs:', data.length);
      },
      error: (error) => {
        this.errorMessage = 'Failed to load blogs. Please try again.';
        this.isLoading.set(false);
        console.error('Error loading blogs:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
      }
    });
  }

  filterBlogs(): void {
    let result = [...this.blogs];

    // Filter by category if search query exists
    if (this.searchQuery && this.searchQuery.trim() !== '') {
      const query = this.searchQuery.toLowerCase().trim();
      result = result.filter(blog => 
        blog.blogCategory.toLowerCase().includes(query)
      );
    }

    // Filter by date range if dates are provided
    if (this.fromDate || this.toDate) {
      result = result.filter(blog => {
        const blogDate = new Date(blog.blogCreationTime);
        blogDate.setHours(0, 0, 0, 0); // Reset time for date-only comparison

        let matchesFromDate = true;
        let matchesToDate = true;

        if (this.fromDate) {
          const fromDateTime = new Date(this.fromDate);
          fromDateTime.setHours(0, 0, 0, 0);
          matchesFromDate = blogDate >= fromDateTime;
        }

        if (this.toDate) {
          const toDateTime = new Date(this.toDate);
          toDateTime.setHours(23, 59, 59, 999); // End of day
          matchesToDate = blogDate <= toDateTime;
        }

        return matchesFromDate && matchesToDate;
      });
    }

    this.filteredBlogs = result;
  }

  viewBlog(blogId: string): void {
    console.log('Viewing blog:', blogId);
    // Navigate to blog detail page
    this.router.navigate(['/view-blog', this.userId, blogId]);
  }

  deleteBlog(blogId: string): void {
    if (confirm('Are you sure you want to delete this blog?')) {
      this.blogService.deleteBlog(blogId).subscribe({
        next: () => {
          console.log('Blog deleted successfully');
          // Reload blogs after deletion
          this.loadBlogs();
          alert('Blog deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting blog:', error);
          alert('Failed to delete blog. Please try again.');
        }
      });
    }
  }

  createNewBlog(): void {
    // Navigate to create blog page
    this.router.navigate(['/create-blog', this.userId]);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  truncateText(text: string, maxLength: number = 150): string {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  }

  clearDateFilter(): void {
    this.fromDate = '';
    this.toDate = '';
    this.filterBlogs();
  }

  hasActiveFilters(): boolean {
    return (this.searchQuery && this.searchQuery.trim() !== '') || 
           this.fromDate !== '' || 
           this.toDate !== '';
  }

}
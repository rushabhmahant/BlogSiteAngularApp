import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { BlogService, Blog } from '../services/blog-service';

@Component({
  selector: 'app-blog-list',
  imports: [CommonModule],
  templateUrl: './blog-list.html',
  styleUrl: './blog-list.css',
})
export class BlogList implements OnInit {

  blogs: Blog[] = [];
  isLoading = signal(true);
  errorMessage: string = '';
  userId: number = 0;

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

}

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { BlogService, Blog } from '../services/blog-service';

@Component({
  selector: 'app-view-blog',
  imports: [CommonModule],
  templateUrl: './view-blog.html',
  styleUrl: './view-blog.css',
})
export class ViewBlog implements OnInit {

  blogId: string = '';
  userId: string = '';
  blog: Blog | null = null;
  isLoading = signal(true);
  errorMessage: string = '';

  constructor(
    private blogService: BlogService,
    private router: Router, 
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Check if user is logged in
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      // Redirect to login if not authenticated
      this.router.navigate(['/login']);
      return;
    }

    this.activatedRoute.paramMap.subscribe(params => {
      const blogIdParam = params.get('blogId');
      const userIdParam = params.get('userId');
      console.log('Route params:', params);
      console.log('blogId param:', blogIdParam);

      if (blogIdParam && userIdParam) {
        this.blogId = blogIdParam;
        console.log('Parsed blogId:', this.blogId);
        this.userId = userIdParam;
        this.loadBlog();
      } else if (blogIdParam) {
        this.blogId = blogIdParam;
        this.userId = storedUserId;
        this.loadBlog();
      } else {
        this.errorMessage = 'Blog ID not found';
        this.isLoading.set(false);
      }
    });
  }

  loadBlog(): void {
    this.isLoading.set(true);
    this.errorMessage = '';

    this.blogService.getBlogById(this.blogId).subscribe({
      next: (data) => {
        this.blog = data;
        this.isLoading.set(false);
        console.log('Blog loaded successfully:', data);
      },
      error: (error) => {
        this.errorMessage = 'Failed to load blog. Please try again.';
        this.isLoading.set(false);
        console.error('Error loading blog:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/blog-list', this.userId]);
  }

  editBlog(): void {
    // Navigate to edit page (to be implemented)
    alert('Edit functionality - To be implemented');
  }

  deleteBlog(): void {
    if (confirm('Are you sure you want to delete this blog?')) {
      this.blogService.deleteBlog(this.blogId).subscribe({
        next: () => {
          alert('Blog deleted successfully!');
          this.router.navigate(['/blog-list']);
        },
        error: (error) => {
          console.error('Error deleting blog:', error);
          alert('Failed to delete blog. Please try again.');
        }
      });
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  shareOnTwitter(): void {
    if (this.blog) {
      const text = encodeURIComponent(`Check out this blog: ${this.blog.blogName}`);
      const url = encodeURIComponent(window.location.href);
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    }
  }

  shareOnFacebook(): void {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  }

  copyLink(): void {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Link copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy link');
    });
  }
}

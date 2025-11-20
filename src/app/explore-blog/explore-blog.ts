import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Blog } from '../services/blog-service';
import { SAMPLE_BLOGS } from '../data/sample-blogs';

@Component({
  selector: 'app-explore-blog',
  imports: [CommonModule],
  templateUrl: './explore-blog.html',
  styleUrl: './explore-blog.css',
})
export class ExploreBlog implements OnInit {

  blogs: Blog[] = [];
  isLoading = signal(true);
  selectedBlog: Blog | null = null;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Simulate loading delay for better UX
    setTimeout(() => {
      this.blogs = SAMPLE_BLOGS;
      this.isLoading.set(false);
    }, 500);
  }

  viewBlog(blog: Blog): void {
    // Set the selected blog to display in modal
    this.selectedBlog = blog;
  }

  closeModal(): void {
    this.selectedBlog = null;
  }

  truncateText(text: string, maxLength: number = 150): string {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  }

}

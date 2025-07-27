import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class Profile implements OnInit {
  user: any = null;
  loading = true;
  error: string | null = null;
  editing = false;
  originalUser: any = null;

  // Form fields for editing
  editForm = {
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.loading = true;
    this.authService.getCurrentUser().subscribe({
      next: (user: any) => {
        if (user) {
          this.user = user;
          this.editForm.firstName = user.firstName || '';
          this.editForm.lastName = user.lastName || '';
          this.editForm.email = user.email || '';
          this.originalUser = { ...user };
        }
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load profile';
        this.loading = false;
        console.error('Error loading profile:', error);
      }
    });
  }

  toggleEdit(): void {
    if (this.editing) {
      // Cancel editing - restore original values
      this.editForm.firstName = this.originalUser?.firstName || '';
      this.editForm.lastName = this.originalUser?.lastName || '';
      this.editForm.email = this.originalUser?.email || '';
      this.editForm.currentPassword = '';
      this.editForm.newPassword = '';
      this.editForm.confirmPassword = '';
    }
    this.editing = !this.editing;
  }

  saveProfile(): void {
    if (this.editForm.newPassword && this.editForm.newPassword !== this.editForm.confirmPassword) {
      this.error = 'New passwords do not match';
      return;
    }

    const updateData: any = {
      firstName: this.editForm.firstName,
      lastName: this.editForm.lastName,
      email: this.editForm.email
    };

    if (this.editForm.newPassword) {
      updateData.currentPassword = this.editForm.currentPassword;
      updateData.newPassword = this.editForm.newPassword;
    }

    this.authService.updateProfile(updateData).subscribe({
      next: (updatedUser: any) => {
        this.user = updatedUser;
        this.originalUser = { ...updatedUser };
        this.editing = false;
        this.editForm.currentPassword = '';
        this.editForm.newPassword = '';
        this.editForm.confirmPassword = '';
        this.error = null;
        alert('Profile updated successfully!');
      },
      error: (error: any) => {
        this.error = error.error?.message || 'Failed to update profile';
        console.error('Error updating profile:', error);
      }
    });
  }

  deleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      const password = prompt('Please enter your password to confirm account deletion:');
      if (password) {
        this.authService.deleteAccount(password).subscribe({
          next: () => {
            alert('Account deleted successfully');
            this.authService.logout();
            this.router.navigate(['/']);
          },
          error: (error: any) => {
            this.error = error.error?.message || 'Failed to delete account';
            console.error('Error deleting account:', error);
          }
        });
      }
    }
  }
}

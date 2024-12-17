// import { Component, OnInit } from '@angular/core';
// import { EmployeeNotificationService } from '../services/employee-notification.service';
// import { Notification } from '../models/notifiction.model';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-employee-notification',
//   templateUrl: './employee-notification.component.html',
//   styleUrls: ['./employee-notification.component.css']
// })
// export class EmployeeNotificationComponent implements OnInit {
//   notifications: Notification[] = [];
  // icons = [
  //   { symbol: '🏠', label: 'Home', route: '/' },
  //   { symbol: '📋', label: 'Tasks', route: '/task' },
  //   { symbol: '📊', label: 'Performance', route: '/performance' },
  //   { symbol: '🔔', label: 'Notifications', route: '/notifications' },
  //   { symbol: '👤', label: 'Sign-out', route: '/auth' }
  // ];
  // isDarkTheme = false;
  // themeIcon = '🌞';
  // isSidebarCollapsed = false;


//   constructor(private employeeNotificationService: EmployeeNotificationService,private router:Router) {}

//   ngOnInit(): void {
//     console.log('EmployeeNotificationComponent initialized');
//     this.loadNotifications();
//   }

//   loadNotifications(): void {
//     console.log('Loading notifications...');
//     this.employeeNotificationService.getNotificationsForEmployee().subscribe(notifications => {
//       console.log('Notifications received:', notifications);
//       this.notifications = notifications;
//     }, error => {
//       console.error('Error loading notifications:', error);
//     });
//   }
//   toggleTheme(): void {
//     this.isDarkTheme = !this.isDarkTheme;
//     this.themeIcon = this.isDarkTheme ? '🌜' : '🌞';
//   }

//   navigate(route: string): void {
//     this.router.navigate([route]);
//   }

//   toggleSidebar() {
//     const sidebar = document.querySelector('.sidebar');
//     if (sidebar) {
//       sidebar.classList.toggle('expanded');
//     }
//   }
// }
import { Component, OnInit } from '@angular/core';
import { EmployeeNotificationService } from '../services/employee-notification.service';
import { Notification } from '../models/notifiction.model';
import { Timestamp } from 'firebase/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-notification',
  templateUrl: './employee-notification.component.html',
  styleUrls: ['./employee-notification.component.css']
})
export class EmployeeNotificationComponent implements OnInit {
  notifications: Notification[] = [];
  icons = [
    { symbol: '🏠', label: 'Home', route: '/' },
    { symbol: '📋', label: 'Tasks', route: '/task' },
    { symbol: '📊', label: 'Performance', route: '/performance' },
    { symbol: '🔔', label: 'Notifications', route: '/notifications' },
    { symbol: '👤', label: 'Sign-out', route: '/auth' }
  ];
  isDarkTheme = false;
  themeIcon = '🌞';
  isSidebarCollapsed = false;

  constructor(private notificationService: EmployeeNotificationService, private router: Router) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    console.log('Loading notifications...');
    this.notificationService.getNotificationsForEmployee().subscribe(
      notifications => {
        console.log('Notifications received:', notifications);
        this.notifications = this.removeDuplicateNotifications(notifications);
        this.notifications = this.limitNotificationsToTen(this.notifications); // Limit to 10 notifications
        this.convertTimestamps(); // Convert timestamps to dates
      },
      error => console.error('Error loading notifications:', error)
    );
  }

  // Limit the number of notifications to 10
  limitNotificationsToTen(notifications: Notification[]): Notification[] {
    return notifications.slice(0, 10);
  }

  // Convert Firestore Timestamp to Date
  convertTimestamps(): void {
    this.notifications = this.notifications.map(notification => {
      if (notification.deadline instanceof Timestamp) {
        notification.deadline = notification.deadline.toDate();
      }
      return notification;
    });
  }

  // Remove duplicate notifications based on task title and date
  removeDuplicateNotifications(notifications: Notification[]): Notification[] {
    const seen = new Set();
    return notifications.filter(notification => {
      const uniqueKey = `${notification.title}-${this.formatDate(notification.deadline)}`;
      if (!seen.has(uniqueKey)) {
        seen.add(uniqueKey);
        return true;
      }
      return false;
    });
  }

  // Format date as YYYY-MM-DD
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Toggle between light and dark theme
  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.themeIcon = this.isDarkTheme ? '🌜' : '🌞';
  }

  // Navigate to different routes
  navigate(route: string): void {
    this.router.navigate([route]);
  }

  // Toggle sidebar expansion
  toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.toggle('expanded');
    }
  }
}

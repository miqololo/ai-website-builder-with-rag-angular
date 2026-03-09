import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import {
  HeaderNavbarComponent,
  HeroEducationalComponent,
  CoursesGridComponent,
  FeaturesSectionComponent,
  TestimonialsComponent,
  CtaSectionComponent,
  FaqComponent,
  FooterComponent
} from './index';

@Component({
  selector: 'app-theme1-test',
  standalone: true,
  imports: [
    CommonModule,
    HeaderNavbarComponent,
    HeroEducationalComponent,
    CoursesGridComponent,
    FeaturesSectionComponent,
    TestimonialsComponent,
    CtaSectionComponent,
    FaqComponent,
    FooterComponent
  ],
  template: `
    <div class="min-h-screen bg-white dark:bg-gray-900">
      <!-- Header Navbar -->
      <theme1-header-navbar [config]="headerConfig"></theme1-header-navbar>

      <!-- Hero Section -->
      <theme1-hero-educational [config]="heroConfig"></theme1-hero-educational>

      <!-- Courses Grid -->
      <theme1-courses-grid [config]="coursesConfig"></theme1-courses-grid>

      <!-- Features Section -->
      <theme1-features-section [config]="featuresConfig"></theme1-features-section>

      <!-- Testimonials -->
      <theme1-testimonials [config]="testimonialsConfig"></theme1-testimonials>

      <!-- FAQ Section -->
      <theme1-faq [config]="faqConfig"></theme1-faq>

      <!-- CTA Section -->
      <theme1-cta-section [config]="ctaConfig"></theme1-cta-section>

      <!-- Footer -->
      <theme1-footer [config]="footerConfig"></theme1-footer>
    </div>
  `,
  styles: []
})
export class Theme1TestPageComponent {
  headerConfig: ComponentConfig = {
    type: 'theme1-header-navbar',
    data: {
      logoText: 'EduLearn',
      logoUrl: '#',
      navItems: [
        { label: 'Courses', url: '#courses' },
        { label: 'Instructors', url: '#instructors' },
        { label: 'About', url: '#about' },
        { label: 'Contact', url: '#contact' }
      ],
      loginText: 'Log In',
      loginUrl: '#login',
      signupText: 'Sign Up',
      signupUrl: '#signup'
    }
  };

  heroConfig: ComponentConfig = {
    type: 'theme1-hero-educational',
    data: {
      badge: 'Start Learning Today',
      title: 'Transform Your Future with',
      titleHighlight: 'Expert-Led Courses',
      subtitle: 'Join thousands of students learning new skills and advancing their careers with our comprehensive online courses.',
      primaryCtaText: 'Browse Courses',
      primaryCtaUrl: '#courses',
      secondaryCtaText: 'Watch Demo',
      secondaryCtaUrl: '#demo',
      stats: [
        { value: '10K+', label: 'Active Students' },
        { value: '500+', label: 'Expert Instructors' },
        { value: '100+', label: 'Courses Available' }
      ]
    }
  };

  coursesConfig: ComponentConfig = {
    type: 'theme1-courses-grid',
    data: {
      title: 'Explore Our Courses',
      subtitle: 'Choose from hundreds of courses taught by industry experts',
      viewAllText: 'View All Courses',
      viewAllUrl: '#all-courses',
      courses: [
        {
          title: 'Complete Web Development Bootcamp',
          description: 'Master HTML, CSS, JavaScript, React, Node.js and more. Build real-world projects.',
          category: 'Web Development',
          level: 'Beginner',
          instructor: 'Sarah Johnson',
          instructorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
          image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
          lessons: 120,
          rating: '4.8',
          price: '$99',
          originalPrice: '$199',
          url: '#course-1'
        },
        {
          title: 'Data Science & Machine Learning',
          description: 'Learn Python, pandas, scikit-learn, and TensorFlow. Analyze data and build ML models.',
          category: 'Data Science',
          level: 'Intermediate',
          instructor: 'Michael Chen',
          instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
          lessons: 95,
          rating: '4.9',
          price: '$129',
          originalPrice: '$249',
          url: '#course-2'
        },
        {
          title: 'UI/UX Design Masterclass',
          description: 'Learn design principles, Figma, prototyping, and user research. Create stunning interfaces.',
          category: 'Design',
          level: 'Beginner',
          instructor: 'Emily Rodriguez',
          instructorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
          image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop',
          lessons: 80,
          rating: '4.7',
          price: '$89',
          originalPrice: '$179',
          url: '#course-3'
        }
      ]
    }
  };

  featuresConfig: ComponentConfig = {
    type: 'theme1-features-section',
    data: {
      title: 'Why Choose Our Platform',
      subtitle: 'Everything you need to succeed in your learning journey',
      features: [
        {
          title: 'Video-Based Learning',
          description: 'Learn at your own pace with high-quality video lectures from industry experts. Pause, rewind, and rewatch as needed.',
          icon: 'video'
        },
        {
          title: 'Certificates of Completion',
          description: 'Earn verifiable certificates that you can share on LinkedIn and add to your resume to showcase your skills.',
          icon: 'certificate'
        },
        {
          title: '24/7 Support',
          description: 'Get help whenever you need it. Our support team and community are always ready to assist you.',
          icon: 'support'
        },
        {
          title: 'Mobile-Friendly',
          description: 'Access your courses anywhere, anytime. Our platform works seamlessly on all devices - desktop, tablet, and mobile.',
          icon: 'mobile'
        },
        {
          title: 'Active Community',
          description: 'Join thousands of learners in our community. Share projects, ask questions, and network with peers.',
          icon: 'community'
        },
        {
          title: 'Lifetime Access',
          description: 'Once you enroll, you get lifetime access to course materials, including future updates and new content.',
          icon: 'lifetime'
        }
      ]
    }
  };

  testimonialsConfig: ComponentConfig = {
    type: 'theme1-testimonials',
    data: {
      title: 'What Our Students Say',
      subtitle: 'Join thousands of satisfied learners who have transformed their careers',
      testimonials: [
        {
          name: 'Alexandra Martinez',
          role: 'Software Engineer',
          quote: 'The courses here completely changed my career trajectory. The instructors are knowledgeable and the content is practical. I landed my dream job within 3 months!',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
        },
        {
          name: 'James Wilson',
          role: 'Data Analyst',
          quote: 'Best investment I\'ve made in my education. The data science course was comprehensive and the projects were real-world applicable. Highly recommend!',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
        },
        {
          name: 'Priya Patel',
          role: 'UX Designer',
          quote: 'As someone switching careers, I was nervous. But the step-by-step approach and supportive community made all the difference. Now I\'m working at a top design agency.',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
        }
      ]
    }
  };

  ctaConfig: ComponentConfig = {
    type: 'theme1-cta-section',
    data: {
      badge: 'Start Learning Today',
      title: 'Ready to Start Your Learning Journey?',
      description: 'Join thousands of students already learning with us. Start your free trial today and unlock unlimited access to all courses.',
      primaryCtaText: 'Start Free Trial',
      primaryCtaUrl: '#signup',
      secondaryCtaText: 'Browse Courses',
      secondaryCtaUrl: '#courses'
    }
  };

  faqConfig: ComponentConfig = {
    type: 'theme1-faq',
    data: {
      title: 'Frequently Asked Questions',
      subtitle: 'Find answers to common questions about our platform and courses',
      faqs: [
        {
          question: 'How do I enroll in a course?',
          answer: 'Simply browse our course catalog, select the course you\'re interested in, and click "Enroll Now". You can start learning immediately after enrollment. All courses include lifetime access, so you can learn at your own pace.'
        },
        {
          question: 'Do I get a certificate after completing a course?',
          answer: 'Yes! Upon successful completion of a course, you\'ll receive a verifiable certificate that you can share on LinkedIn, add to your resume, or include in your portfolio. Our certificates are recognized by industry professionals.'
        },
        {
          question: 'Can I access courses on mobile devices?',
          answer: 'Absolutely! Our platform is fully responsive and works seamlessly on desktop, tablet, and mobile devices. You can download our mobile app or access courses directly through your mobile browser.'
        },
        {
          question: 'What if I need help during a course?',
          answer: 'We offer 24/7 support through our community forums, direct messaging with instructors, and our support team. You can also join study groups and connect with other learners for peer support.'
        },
        {
          question: 'Are there any prerequisites for courses?',
          answer: 'Most courses are designed for beginners, but some advanced courses may have prerequisites. These are clearly listed on each course page. We also offer learning paths to help you progress from beginner to advanced levels.'
        },
        {
          question: 'Can I get a refund if I\'m not satisfied?',
          answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied with your course for any reason, contact our support team within 30 days of enrollment for a full refund.'
        }
      ]
    }
  };

  footerConfig: ComponentConfig = {
    type: 'theme1-footer',
    data: {
      brandName: 'EduLearn',
      brandDescription: 'Transform your future with expert-led courses. Join thousands of students learning new skills.',
      socialLinks: [
        { name: 'facebook', url: 'https://facebook.com' },
        { name: 'twitter', url: 'https://twitter.com' },
        { name: 'linkedin', url: 'https://linkedin.com' },
        { name: 'instagram', url: 'https://instagram.com' }
      ],
      footerColumns: [
        {
          title: 'Courses',
          links: [
            { label: 'All Courses', url: '#courses' },
            { label: 'Web Development', url: '#web-dev' },
            { label: 'Data Science', url: '#data-science' },
            { label: 'Design', url: '#design' }
          ]
        },
        {
          title: 'Company',
          links: [
            { label: 'About Us', url: '#about' },
            { label: 'Instructors', url: '#instructors' },
            { label: 'Careers', url: '#careers' },
            { label: 'Blog', url: '#blog' }
          ]
        },
        {
          title: 'Support',
          links: [
            { label: 'Help Center', url: '#help' },
            { label: 'Contact Us', url: '#contact' },
            { label: 'Privacy Policy', url: '#privacy' },
            { label: 'Terms of Service', url: '#terms' }
          ]
        }
      ],
      newsletterTitle: 'Stay Updated',
      newsletterDescription: 'Subscribe to our newsletter to get the latest course updates and learning tips.',
      copyrightText: `© ${new Date().getFullYear()} EduLearn. All rights reserved.`,
      bottomLinks: [
        { label: 'Privacy Policy', url: '#privacy' },
        { label: 'Terms of Service', url: '#terms' },
        { label: 'Cookie Policy', url: '#cookies' }
      ]
    }
  };
}

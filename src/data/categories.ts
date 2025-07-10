import { CategoryInfo } from '../types';

export const categories: CategoryInfo[] = [
  {
    id: '0-6-months',
    name: '0-6 Months',
    displayName: 'Newborn Essentials',
    description: 'Everything your newborn needs for their first 6 months',
    bannerImages: [
      'https://images.unsplash.com/photo-1546015720-b8b30df5aa27?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1587318123555-4d7d4db82ba7?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1515488042361-ee33e5f04ead?w=800&h=400&fit=crop',
    ],
    color: 'cyber-400',
    gradientFrom: 'from-cyber-400',
    gradientTo: 'to-neon-400',
  },
  {
    id: '6-12-months',
    name: '6-12 Months',
    displayName: 'Growing Explorer',
    description: 'Support your baby\'s development and exploration',
    bannerImages: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=800&h=400&fit=crop',
    ],
    color: 'neon-400',
    gradientFrom: 'from-neon-400',
    gradientTo: 'to-electric-400',
  },
  {
    id: '1-3-years',
    name: '1-3 Years',
    displayName: 'Active Toddler',
    description: 'Gear for your active and curious toddler',
    bannerImages: [
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800&h=400&fit=crop',
    ],
    color: 'electric-400',
    gradientFrom: 'from-electric-400',
    gradientTo: 'to-cyber-400',
  },
  {
    id: '3-5-years',
    name: '3-5 Years',
    displayName: 'Young Learner',
    description: 'Educational and fun products for preschoolers',
    bannerImages: [
      'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1564533322166-638b3e34e50e?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&h=400&fit=crop',
    ],
    color: 'neon-500',
    gradientFrom: 'from-neon-500',
    gradientTo: 'to-cyber-500',
  },
]; 
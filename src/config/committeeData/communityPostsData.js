export const getInitialCommunityData = (committeeSlug = 'artikon') => {
  return {
    banner: {
      icon: '👑',
      text: 'You had 20k visitors this week',
      subtext: 'Your committee posts gained 45% more engagement on campus.',
    },
    currentUserProfile: {
      name: 'Salahudin Jafar',
      handle: 'salahjafar20',
      role: 'Core Member & Designer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
      verified: true,
      stats: {
        posts: 201,
        followers: '11.2K',
        following: 501,
      },
    },
    channels: [
      { id: 'fav-1', name: 'Jeff Mickhael', type: 'user', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80', isFav: true },
      { id: 'fav-2', name: 'Naomi Yashida', type: 'user', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80', isFav: true },
      { id: 'fav-3', name: 'Anya Gerald', type: 'user', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80', isFav: true },
      { id: 'fav-4', name: '3D Blender Guild', type: 'group', icon: '🧊', isFav: true },
    ],
    communities: [
      { id: 'com-1', name: '3D Blender', icon: '🧊', active: true, count: 142 },
      { id: 'com-2', name: 'Logo Designer', icon: '✒️', active: true, count: 98 },
      { id: 'com-3', name: 'Brand Designer', icon: '🎨', active: true, count: 215 },
      { id: 'com-4', name: 'Photography', icon: '📷', active: true, count: 83 },
      { id: 'com-5', name: 'Motion & VFX', icon: '🔮', active: false, count: 64 },
    ],
    followingList: [
      { id: 'f-1', name: 'Jeff Mickhael', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80', online: true },
      { id: 'f-2', name: 'Naomi Yashida', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80', online: true },
      { id: 'f-3', name: 'Anya Gerald', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80', online: false },
      { id: 'f-4', name: 'M. Benar', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', online: true },
      { id: 'f-5', name: 'Willy Wingko', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80', online: false },
    ],
    recommendations: [
      { id: 'rec-1', name: 'Iman Usmani', mutuals: '15 mutuals', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80' },
      { id: 'rec-2', name: 'Maido Mane', mutuals: '24 mutuals', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80' },
      { id: 'rec-3', name: 'Javier Arifin', mutuals: '7 mutuals', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80' },
      { id: 'rec-4', name: 'Ismail bin Mail', mutuals: '31 mutuals', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&q=80' },
    ],
    topics: [
      'Design',
      'User Experience',
      'UI',
      'Photoshop',
      'Viral',
      'Illustration',
      'Print Design',
      'Productivity',
      '3D Artwork',
    ],
    posts: [
      {
        id: 'post-1',
        author: {
          name: 'Naomi Yashida',
          role: 'Vice President & Content Lead',
          location: 'Charlettown • MSIT Design Guild',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
          time: '3 hours ago',
        },
        content:
          "More effort is wasted doing things that don't matter than is wasted doing things inefficiently. And if that is the case, elimination is a more useful skill than optimization. I am reminded of the famous Peter Drucker quote: 'There is nothing so useless as doing efficiently that which should not be done at all.'",
        tags: ['#Tips', '#ProductivityHacks', '#SelfDev', '#DesignSprint'],
        upvotes: 4124,
        isUpvoted: false,
        commentsCount: 31,
        sharesCount: 18,
        media: [],
        comments: [
          {
            id: 'c-1',
            author: {
              name: 'Ismail bin Mail',
              avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&q=80',
              time: '2h',
            },
            text: "I am reminded of the famous Peter Drucker quote, 'There is nothing so useless as doing efficiently that which should not be done at all.'",
            likes: 12,
            isLiked: false,
            replies: [
              {
                id: 'r-1',
                author: {
                  name: 'You',
                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
                  time: '2h',
                },
                text: 'Love it bro!',
                likes: 12,
                isLiked: true,
              },
            ],
          },
        ],
      },
      {
        id: 'post-2',
        author: {
          name: 'Mohammed Benar',
          role: 'Head of Visual Identity',
          location: 'Merseyside • Campus Lab 4',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
          time: '5 hours ago',
        },
        content:
          'Sneak peek of our photography and stage landscape series curated for Paridhi 2026. The atmosphere and light study took over 3 weeks of morning shots across campus lawn.',
        tags: ['#Photography', '#Landscape', '#CampusMoments', '#Paridhi2026'],
        upvotes: 1890,
        isUpvoted: true,
        commentsCount: 14,
        sharesCount: 29,
        media: [
          'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1460661419200-1845a1ca857e?auto=format&fit=crop&w=900&q=80',
        ],
        comments: [
          {
            id: 'c-20',
            author: {
              name: 'Anya Gerald',
              avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
              time: '3h',
            },
            text: 'The tones in the second picture are surreal! Is this captured with 35mm?',
            likes: 8,
            isLiked: false,
            replies: [],
          },
        ],
      },
      {
        id: 'post-3',
        author: {
          name: 'Piyush Dawn',
          role: 'Founder & President',
          location: 'Kolkata • Council Desk',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
          time: '1 day ago',
        },
        content:
          'Announcing ArtiKon Design Sprint 2026! Registrations are now officially live on the Artiverse portal. 48 hours, mentors from Figma Campus, and ₹25,000 in prizes. Check out the project brief attached!',
        tags: ['#DesignSprint', '#Hackathon', '#FigmaCampus', '#RegistrationsLive'],
        upvotes: 5630,
        isUpvoted: false,
        commentsCount: 52,
        sharesCount: 64,
        media: [
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        ],
        comments: [],
      },
    ],
  }
}


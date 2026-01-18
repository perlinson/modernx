// API 服务
class APIService {
  constructor() {
    this.baseURL = 'https://jsonplaceholder.typicode.com';
  }
  
  // 获取用户数据
  async fetchUsers() {
    try {
      const response = await fetch(`${this.baseURL}/users`);
      const users = await response.json();
      return users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        phone: user.phone,
        website: user.website,
        company: user.company.name
      }));
    } catch (error) {
      console.error('获取用户数据失败:', error);
      return [];
    }
  }
  
  // 获取文章数据
  async fetchPosts() {
    try {
      const response = await fetch(`${this.baseURL}/posts`);
      const posts = await response.json();
      return posts.slice(0, 10).map(post => ({
        id: post.id,
        title: post.title,
        body: post.body.substring(0, 100) + '...',
        userId: post.userId
      }));
    } catch (error) {
      console.error('获取文章数据失败:', error);
      return [];
    }
  }
  
  // 模拟延迟
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // 批量操作
  async fetchAllData() {
    console.log('开始获取所有数据...');
    await this.delay(500);
    
    const [users, posts] = await Promise.all([
      this.fetchUsers(),
      this.fetchPosts()
    ]);
    
    console.log('数据获取完成:', { usersCount: users.length, postsCount: posts.length });
    return { users, posts };
  }
  
  // 搜索功能
  async search(query, type = 'all') {
    console.log(`搜索 ${type}: ${query}`);
    await this.delay(300);
    
    if (type === 'users' || type === 'all') {
      const users = await this.fetchUsers();
      const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      );
      
      if (type === 'users') return { users: filteredUsers };
    }
    
    if (type === 'posts' || type === 'all') {
      const posts = await this.fetchPosts();
      const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.body.toLowerCase().includes(query.toLowerCase())
      );
      
      if (type === 'posts') return { posts: filteredPosts };
    }
    
    // 搜索所有类型
    const [users, posts] = await Promise.all([
      this.fetchUsers(),
      this.fetchPosts()
    ]);
    
    const filteredUsers = users.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    );
    
    const filteredPosts = posts.filter(post => 
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.body.toLowerCase().includes(query.toLowerCase())
    );
    
    return { users: filteredUsers, posts: filteredPosts };
  }
}

export default new APIService();

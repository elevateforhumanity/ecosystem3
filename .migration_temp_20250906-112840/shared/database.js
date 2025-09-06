// Shared database utilities for EFH microservices
const { Client } = require('pg');
const { ENV } = require('./config');

class DatabaseManager {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected) {
      return this.client;
    }

    try {
      this.client = new Client({
        connectionString: ENV.DATABASE_URL
      });
      
      await this.client.connect();
      this.isConnected = true;
      console.log('✅ Database connected successfully');
      return this.client;
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.client && this.isConnected) {
      await this.client.end();
      this.isConnected = false;
      console.log('🔌 Database disconnected');
    }
  }

  async query(text, params = []) {
    if (!this.isConnected) {
      await this.connect();
    }
    return this.client.query(text, params);
  }

  // Common database operations
  async createUser(userData) {
    const query = `
      INSERT INTO users (email, auth_id, created_at)
      VALUES ($1, $2, NOW())
      RETURNING id, email, created_at
    `;
    const result = await this.query(query, [userData.email, userData.auth_id]);
    return result.rows[0];
  }

  async getUserById(userId) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.query(query, [userId]);
    return result.rows[0];
  }

  async getUserByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await this.query(query, [email]);
    return result.rows[0];
  }

  // Enrollment operations
  async createEnrollment(enrollmentData) {
    const query = `
      INSERT INTO enrollments (user_id, program_slug, status, enrolled_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *
    `;
    const result = await this.query(query, [
      enrollmentData.user_id,
      enrollmentData.program_slug,
      enrollmentData.status || 'pending'
    ]);
    return result.rows[0];
  }

  async getUserEnrollments(userId) {
    const query = 'SELECT * FROM enrollments WHERE user_id = $1 ORDER BY enrolled_at DESC';
    const result = await this.query(query, [userId]);
    return result.rows;
  }

  // Payment operations
  async createPayment(paymentData) {
    const query = `
      INSERT INTO payments (user_id, amount, currency, stripe_payment_intent_id, status, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *
    `;
    const result = await this.query(query, [
      paymentData.user_id,
      paymentData.amount,
      paymentData.currency || 'usd',
      paymentData.stripe_payment_intent_id,
      paymentData.status || 'pending'
    ]);
    return result.rows[0];
  }

  // Health check
  async healthCheck() {
    try {
      const result = await this.query('SELECT NOW() as timestamp');
      return {
        status: 'healthy',
        timestamp: result.rows[0].timestamp,
        connected: this.isConnected
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        connected: false
      };
    }
  }
}

// Create singleton instance
const db = new DatabaseManager();

module.exports = db;
import { NextRequest, NextResponse } from 'next/server';
import { getUsers, getUserById, getUserByUsername } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const username = searchParams.get('username');
    
    if (id) {
      const user = getUserById(id);
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        user
      });
    }
    
    if (username) {
      const user = getUserByUsername(username);
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        user
      });
    }
    
    const users = getUsers();
    return NextResponse.json({
      success: true,
      users,
      count: users.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
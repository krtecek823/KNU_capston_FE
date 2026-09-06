import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HotelCard } from '../components/HotelCard';
import { Hotel } from '../types';

const mockHotel: Hotel = {
  id: 'signiel-seoul',
  name: '시그니엘 서울 (Signiel Seoul)',
  location: '서울 송파구 잠실',
  category: '5성급 럭셔리 스테이',
  rating: 4.9,
  reviewCount: 1280,
  originalPrice: 650000,
  discountPrice: 520000,
  imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
  description: '초고층 파노라마 뷰와 최상급 컨시어지 서비스를 제공하는 럭셔리 호텔',
  tags: ['파노라마 뷰', '실내 수영장', '초고층 스카이라인'],
  features: ['초고층 스카이 뷰', '실내 온수 수영장'],
  address: '서울특별시 송파구 올림픽로 300 롯데월드타워',
};

describe('HotelCard Component', () => {
  it('renders hotel information correctly', () => {
    render(
      <BrowserRouter>
        <HotelCard hotel={mockHotel} />
      </BrowserRouter>
    );

    expect(screen.getByText('시그니엘 서울 (Signiel Seoul)')).toBeInTheDocument();
    expect(screen.getByText('서울 송파구 잠실')).toBeInTheDocument();
    expect(screen.getByText('4.9')).toBeInTheDocument();
    expect(screen.getByText('₩520,000')).toBeInTheDocument();
  });
});

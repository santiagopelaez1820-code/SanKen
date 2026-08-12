import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { NewsPromotion } from '@sanken/core';

import { api } from '@/lib/api';
import { useNewsStore } from './news-store';

jest.mock('@/lib/api', () => ({
  api: { get: jest.fn() },
}));

const mockedApi = api as jest.Mocked<typeof api>;

const news: NewsPromotion = {
  id: 1, title: 'Novedad', body: 'Contenido', image_url: null, published: true,
  published_at: '2026-08-01T00:00:00Z', created_at: '2026-08-01T00:00:00Z',
};

beforeEach(() => {
  jest.clearAllMocks();
  useNewsStore.setState({ news: [], isLoading: false });
});

describe('load', () => {
  it('fetches the published news feed', async () => {
    mockedApi.get.mockResolvedValueOnce([news]);

    await useNewsStore.getState().load();

    expect(mockedApi.get).toHaveBeenCalledWith('/news');
    expect(useNewsStore.getState().news).toEqual([news]);
  });
});

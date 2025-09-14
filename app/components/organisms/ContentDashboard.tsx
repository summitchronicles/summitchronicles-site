'use client';

import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { H2, H3, Body, BodyLarge } from '../atoms/Typography';
import { Card, CardContent, CardHeader } from '../molecules/Card';
import { StatusBadge } from '../molecules/StatusBadge';
import { cn } from '@/lib/utils';

interface ContentDashboardProps {
  className?: string;
}

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  category: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  wordCount: number;
  views?: number;
}

const ContentDashboard: React.FC<ContentDashboardProps> = ({ className }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - in real implementation, this would come from your CMS
  const [contentItems] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'Week 12: High-Altitude Simulation Training',
      slug: 'week-12-high-altitude-training',
      status: 'published',
      category: 'training',
      author: 'Summit Chronicles',
      createdAt: '2024-12-14',
      updatedAt: '2024-12-14',
      wordCount: 1240,
      views: 342
    },
    {
      id: '2',
      title: 'Gear Review: Winter Mountaineering Equipment',
      slug: 'winter-mountaineering-gear-review',
      status: 'draft',
      category: 'gear',
      author: 'Summit Chronicles',
      createdAt: '2024-12-13',
      updatedAt: '2024-12-14',
      wordCount: 890
    },
    {
      id: '3',
      title: 'Everest Base Camp Training Progress',
      slug: 'everest-base-camp-training-progress',
      status: 'published',
      category: 'expedition',
      author: 'Summit Chronicles',
      createdAt: '2024-12-10',
      updatedAt: '2024-12-12',
      wordCount: 1560,
      views: 567
    },
    {
      id: '4',
      title: 'Mental Preparation for Extreme Conditions',
      slug: 'mental-preparation-extreme-conditions',
      status: 'archived',
      category: 'insights',
      author: 'Summit Chronicles',
      createdAt: '2024-12-08',
      updatedAt: '2024-12-10',
      wordCount: 2100,
      views: 234
    }
  ]);

  const filteredContent = contentItems.filter(item => {
    const matchesFilter = selectedFilter === 'all' || item.status === selectedFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: contentItems.length,
    published: contentItems.filter(item => item.status === 'published').length,
    draft: contentItems.filter(item => item.status === 'draft').length,
    archived: contentItems.filter(item => item.status === 'archived').length,
    totalViews: contentItems.reduce((sum, item) => sum + (item.views || 0), 0)
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  return (
    <div className={cn('max-w-7xl mx-auto space-y-8', className)}>
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <H2 className="text-spa-charcoal">Content Management</H2>
          <BodyLarge className="text-spa-slate">
            Manage your expedition content, training updates, and insights
          </BodyLarge>
        </div>

        <Button variant="summit" size="md">
          <Icon name="Plus" size="sm" />
          New Content
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card variant="elevated" padding="md" className="text-center">
          <div className="text-2xl font-bold text-alpine-blue mb-1">{stats.total}</div>
          <Body className="text-spa-slate">Total Posts</Body>
        </Card>
        
        <Card variant="elevated" padding="md" className="text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">{stats.published}</div>
          <Body className="text-spa-slate">Published</Body>
        </Card>
        
        <Card variant="elevated" padding="md" className="text-center">
          <div className="text-2xl font-bold text-summit-gold mb-1">{stats.draft}</div>
          <Body className="text-spa-slate">Drafts</Body>
        </Card>
        
        <Card variant="elevated" padding="md" className="text-center">
          <div className="text-2xl font-bold text-spa-slate mb-1">{stats.archived}</div>
          <Body className="text-spa-slate">Archived</Body>
        </Card>
        
        <Card variant="elevated" padding="md" className="text-center">
          <div className="text-2xl font-bold text-alpine-blue mb-1">{stats.totalViews.toLocaleString()}</div>
          <Body className="text-spa-slate">Total Views</Body>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card variant="elevated" padding="md">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {(['all', 'published', 'draft', 'archived'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  selectedFilter === filter
                    ? 'bg-alpine-blue text-white shadow-spa-soft'
                    : 'bg-spa-mist text-spa-charcoal hover:bg-spa-cloud'
                )}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-80">
            <Icon name="Search" size="sm" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-spa-slate" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-spa-cloud focus:outline-none focus:ring-2 focus:ring-alpine-blue focus:border-alpine-blue"
            />
          </div>
        </div>
      </Card>

      {/* Content List */}
      <div className="space-y-4">
        {filteredContent.length === 0 ? (
          <Card variant="elevated" padding="lg">
            <div className="text-center py-8">
              <Icon name="FileText" size="xl" className="text-spa-slate mx-auto mb-4" />
              <H3 className="text-spa-charcoal mb-2">No content found</H3>
              <Body className="text-spa-slate">
                {searchQuery ? 'Try adjusting your search terms' : 'Create your first piece of content to get started'}
              </Body>
            </div>
          </Card>
        ) : (
          filteredContent.map((item) => (
            <Card key={item.id} variant="elevated" padding="lg" className="hover:shadow-spa-medium transition-shadow duration-200">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Content Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <H3 className="text-spa-charcoal">{item.title}</H3>
                    <StatusBadge variant={getStatusVariant(item.status)}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </StatusBadge>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-spa-slate">
                    <span className="flex items-center gap-1">
                      <Icon name="Folder" size="sm" />
                      {item.category}
                    </span>
                    
                    <span className="flex items-center gap-1">
                      <Icon name="FileText" size="sm" />
                      {item.wordCount} words
                    </span>
                    
                    {item.views && (
                      <span className="flex items-center gap-1">
                        <Icon name="Eye" size="sm" />
                        {item.views} views
                      </span>
                    )}
                    
                    <span className="flex items-center gap-1">
                      <Icon name="Calendar" size="sm" />
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Icon name="Eye" size="sm" />
                    Preview
                  </Button>
                  
                  <Button variant="secondary" size="sm">
                    <Icon name="Edit" size="sm" />
                    Edit
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Icon name="Trash2" size="sm" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <Card variant="premium" padding="lg" className="bg-gradient-to-r from-spa-mist to-white border-2 border-spa-cloud/30">
        <div className="text-center space-y-4">
          <H3 className="text-spa-charcoal">Quick Actions</H3>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="primary">
              <Icon name="FileText" size="sm" />
              New Training Update
            </Button>
            
            <Button variant="secondary">
              <Icon name="Camera" size="sm" />
              Upload Images
            </Button>
            
            <Button variant="ghost">
              <Icon name="Settings" size="sm" />
              Content Settings
            </Button>
            
            <Button variant="ghost">
              <Icon name="BarChart3" size="sm" />
              Analytics
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export { ContentDashboard };
export type { ContentDashboardProps };
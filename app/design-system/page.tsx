'use client';

import React from 'react';
import { Button } from '../components/atoms/Button';
import {
  Display,
  DisplayLarge,
  H1,
  H1Large,
  H2,
  H3,
  H4,
  Body,
  BodyLarge,
  Small,
  Caption,
  SeriaText,
  SerifQuote,
} from '../components/atoms/Typography';
import { Input, Textarea } from '../components/atoms/Input';
import { Icon } from '../components/atoms/Icon';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '../components/molecules/Card';
import { FormField } from '../components/molecules/FormField';
import { StatusBadge } from '../components/molecules/StatusBadge';

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-spa-stone">
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Header */}
        <div className="text-center space-y-6">
          <DisplayLarge>Swiss Spa Design System</DisplayLarge>
          <BodyLarge className="max-w-2xl mx-auto text-spa-slate">
            A premium design system for Summit Chronicles, embodying Swiss spa
            aesthetics with clean lines, generous white space, and sophisticated
            typography.
          </BodyLarge>
        </div>

        {/* Color Palette */}
        <section className="space-y-8">
          <H2>Color Palette</H2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Alpine Blue', class: 'bg-alpine-blue', hex: '#1e3a8a' },
              { name: 'Summit Gold', class: 'bg-summit-gold', hex: '#fbbf24' },
              { name: 'Spa Stone', class: 'bg-spa-stone', hex: '#f8fafc' },
              { name: 'Spa Mist', class: 'bg-spa-mist', hex: '#e2e8f0' },
              { name: 'Spa Cloud', class: 'bg-spa-cloud', hex: '#cbd5e1' },
              { name: 'Spa Slate', class: 'bg-spa-slate', hex: '#64748b' },
              {
                name: 'Spa Charcoal',
                class: 'bg-spa-charcoal',
                hex: '#334155',
              },
            ].map((color) => (
              <Card key={color.name} variant="elevated" padding="md">
                <div
                  className={`w-full h-16 rounded-md ${color.class} mb-3`}
                ></div>
                <H4>{color.name}</H4>
                <Small className="font-mono">{color.hex}</Small>
              </Card>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-8">
          <H2>Typography</H2>
          <Card variant="elevated" padding="lg">
            <div className="space-y-8">
              <div>
                <Caption>Display Large (72px)</Caption>
                <DisplayLarge>Premium Mountain Experience</DisplayLarge>
              </div>
              <div>
                <Caption>Display (64px)</Caption>
                <Display>Swiss Spa Aesthetics</Display>
              </div>
              <div>
                <Caption>H1 Large (48px)</Caption>
                <H1Large>Journey to the Summit</H1Large>
              </div>
              <div>
                <Caption>H1 (36px)</Caption>
                <H1>Training & Preparation</H1>
              </div>
              <div>
                <Caption>H2 (32px)</Caption>
                <H2>Equipment & Gear</H2>
              </div>
              <div>
                <Caption>H3 (24px)</Caption>
                <H3>Weekly Progress</H3>
              </div>
              <div>
                <Caption>H4 (20px)</Caption>
                <H4>Daily Insights</H4>
              </div>
              <div>
                <Caption>Body Large (18px)</Caption>
                <BodyLarge>
                  Premium body text for important content and introductions that
                  deserve extra attention.
                </BodyLarge>
              </div>
              <div>
                <Caption>Body (16px)</Caption>
                <Body>
                  Standard body text for comfortable reading experiences across
                  all content areas. Designed with optimal line spacing and
                  character width for extended reading sessions.
                </Body>
              </div>
              <div>
                <Caption>Small (14px)</Caption>
                <Small>
                  Smaller text for captions, metadata, and secondary
                  information.
                </Small>
              </div>
              <div>
                <Caption>Serif Text (18px)</Caption>
                <SeriaText>
                  Elegant serif typography for premium content and storytelling
                  sections that require a more sophisticated typographic
                  treatment.
                </SeriaText>
              </div>
              <div>
                <Caption>Serif Quote</Caption>
                <SerifQuote>
                  "The mountains are calling and I must go. Every step towards
                  the summit is a step towards understanding both the mountain
                  and myself."
                </SerifQuote>
              </div>
            </div>
          </Card>
        </section>

        {/* Buttons */}
        <section className="space-y-8">
          <H2>Buttons</H2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card variant="elevated" padding="lg">
              <H3 className="mb-6">Button Variants</H3>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="summit">Summit</Button>
                </div>
              </div>
            </Card>
            <Card variant="elevated" padding="lg">
              <H3 className="mb-6">Button Sizes</H3>
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Cards & Shadows */}
        <section className="space-y-8">
          <H2>Cards & Elevation</H2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="default" padding="lg">
              <H4>Default Card</H4>
              <Body>
                Subtle shadow with spa-soft elevation for basic content
                containers.
              </Body>
            </Card>
            <Card variant="elevated" padding="lg">
              <H4>Elevated Card</H4>
              <Body>
                Enhanced shadow with hover effects for interactive content
                areas.
              </Body>
            </Card>
            <Card variant="premium" padding="lg">
              <H4>Premium Card</H4>
              <Body>
                Gradient background with maximum elevation for featured content.
              </Body>
            </Card>
          </div>
        </section>

        {/* Form Elements */}
        <section className="space-y-8">
          <H2>Form Elements</H2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card variant="elevated" padding="lg">
              <H3 className="mb-6">Input Components</H3>
              <div className="space-y-6">
                <Input placeholder="Standard input field" />
                <Input label="Labeled Input" placeholder="Enter your email" />
                <Input
                  label="Required Field"
                  placeholder="Required input"
                  required
                />
                <Input
                  label="Error State"
                  placeholder="Invalid input"
                  error="This field is required"
                />
                <Textarea
                  label="Message"
                  placeholder="Enter your message..."
                  rows={4}
                />
              </div>
            </Card>
            <Card variant="elevated" padding="lg">
              <H3 className="mb-6">Form Fields</H3>
              <div className="space-y-6">
                <FormField
                  label="Full Name"
                  placeholder="John Doe"
                  description="Enter your full legal name"
                />
                <FormField
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  required
                />
                <FormField
                  label="Training Goal"
                  placeholder="e.g., Mount Everest 2024"
                  description="What summit are you training for?"
                />
              </div>
            </Card>
          </div>
        </section>

        {/* Status Badges */}
        <section className="space-y-8">
          <H2>Status Badges</H2>
          <Card variant="elevated" padding="lg">
            <div className="space-y-6">
              <div>
                <H4 className="mb-3">Badge Variants</H4>
                <div className="flex flex-wrap gap-3">
                  <StatusBadge variant="default">Default</StatusBadge>
                  <StatusBadge variant="success">Success</StatusBadge>
                  <StatusBadge variant="warning">Warning</StatusBadge>
                  <StatusBadge variant="error">Error</StatusBadge>
                  <StatusBadge variant="info">Info</StatusBadge>
                  <StatusBadge variant="summit">Summit</StatusBadge>
                </div>
              </div>
              <div>
                <H4 className="mb-3">Badge Sizes</H4>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge size="sm" variant="success">
                    Small
                  </StatusBadge>
                  <StatusBadge size="md" variant="success">
                    Medium
                  </StatusBadge>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Icons */}
        <section className="space-y-8">
          <H2>Icons</H2>
          <Card variant="elevated" padding="lg">
            <div className="space-y-6">
              <div>
                <H4 className="mb-3">Icon Sizes</H4>
                <div className="flex items-center gap-4">
                  <Icon name="Mountain" size="sm" />
                  <Icon name="Mountain" size="md" />
                  <Icon name="Mountain" size="lg" />
                  <Icon name="Mountain" size="xl" />
                </div>
              </div>
              <div>
                <H4 className="mb-3">Common Icons</H4>
                <div className="grid grid-cols-6 md:grid-cols-12 gap-4">
                  {[
                    'Mountain',
                    'Trophy',
                    'Target',
                    'Calendar',
                    'Clock',
                    'Activity',
                    'Heart',
                    'MapPin',
                    'Camera',
                    'Share2',
                    'Download',
                    'Upload',
                  ].map((iconName) => (
                    <div
                      key={iconName}
                      className="flex flex-col items-center gap-2"
                    >
                      <Icon
                        name={iconName as any}
                        size="lg"
                        className="text-alpine-blue"
                      />
                      <Caption>{iconName}</Caption>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Layout Example */}
        <section className="space-y-8">
          <H2>Layout Examples</H2>
          <Card variant="premium" padding="lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <H3>Training Progress Update</H3>
                  <Small>Week 12 of 24 • Everest 2024 Preparation</Small>
                </div>
                <StatusBadge variant="summit">On Track</StatusBadge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon
                      name="Activity"
                      size="sm"
                      className="text-alpine-blue"
                    />
                    <H4>Distance</H4>
                  </div>
                  <Display>127</Display>
                  <Small>kilometers this week</Small>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon
                      name="Mountain"
                      size="sm"
                      className="text-alpine-blue"
                    />
                    <H4>Elevation</H4>
                  </div>
                  <Display>2,840</Display>
                  <Small>meters gained</Small>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon name="Clock" size="sm" className="text-alpine-blue" />
                    <H4>Duration</H4>
                  </div>
                  <Display>18.5</Display>
                  <Small>hours of training</Small>
                </div>
              </div>
              <SeriaText>
                This week marked a significant milestone in our Everest
                preparation journey. The combination of high-altitude training
                and technical skill development is building the foundation
                needed for the ultimate ascent.
              </SeriaText>
            </CardContent>
            <CardFooter>
              <Button variant="primary">
                <Icon name="Share2" size="sm" />
                Share Update
              </Button>
              <Button variant="ghost">
                <Icon name="Download" size="sm" />
                Export Data
              </Button>
            </CardFooter>
          </Card>
        </section>
      </div>
    </div>
  );
}

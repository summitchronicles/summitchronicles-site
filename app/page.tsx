import React from 'react';
import { DefaultLayout } from './components/templates/DefaultLayout';
import { HeroSection } from './components/organisms/HeroSection';
import { VisualShowcase } from './components/organisms/VisualShowcase';
import { Button } from './components/atoms/Button';
import { Icon } from './components/atoms/Icon';
import { 
  Display, 
  H2, 
  H3, 
  Body, 
  BodyLarge, 
  SeriaText 
} from './components/atoms/Typography';
import { Card, CardContent, CardHeader } from './components/molecules/Card';
import { StatusBadge } from './components/molecules/StatusBadge';
import { ClimbingRope, IceAxe, Compass, Tent, SummitFlag } from './components/icons/MountaineeringIcons';

export default function Home() {
  return (
    <DefaultLayout>
      {/* Premium Hero Section */}
      <HeroSection />

      {/* Visual Showcase Section */}
      <VisualShowcase />

      {/* Essential Gear Section */}
      <section className="py-16 space-y-12">
        <div className="text-center space-y-4">
          <H2 className="font-oswald">Essential Expedition Gear</H2>
          <Body className="max-w-2xl mx-auto font-montserrat">
            Professional mountaineering equipment essential for high-altitude expedition success
          </Body>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-4xl mx-auto">
          <div className="text-center space-y-4 group">
            <div className="flex justify-center p-4 bg-glacier-50 rounded-xl group-hover:bg-glacier-100 transition-colors duration-300">
              <ClimbingRope 
                size={48} 
                color="#0284c7" 
                animateOnScroll={true}
                className="group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <H3 className="text-sm font-montserrat text-glacier-700">Dynamic Rope</H3>
          </div>

          <div className="text-center space-y-4 group">
            <div className="flex justify-center p-4 bg-peak-50 rounded-xl group-hover:bg-peak-100 transition-colors duration-300">
              <IceAxe 
                size={48} 
                color="#3f3f46" 
                animateOnScroll={true}
                className="group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <H3 className="text-sm font-montserrat text-peak-700">Ice Axe</H3>
          </div>

          <div className="text-center space-y-4 group">
            <div className="flex justify-center p-4 bg-summit-gold-50 rounded-xl group-hover:bg-summit-gold-100 transition-colors duration-300">
              <Compass 
                size={48} 
                color="#d97706" 
                animateOnScroll={true}
                className="group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <H3 className="text-sm font-montserrat text-summit-gold-700">Navigation</H3>
          </div>

          <div className="text-center space-y-4 group">
            <div className="flex justify-center p-4 bg-forest-50 rounded-xl group-hover:bg-forest-100 transition-colors duration-300">
              <Tent 
                size={48} 
                color="#15803d" 
                animateOnScroll={true}
                className="group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <H3 className="text-sm font-montserrat text-forest-700">Base Camp</H3>
          </div>

          <div className="text-center space-y-4 group">
            <div className="flex justify-center p-4 bg-expedition-50 rounded-xl group-hover:bg-expedition-100 transition-colors duration-300">
              <SummitFlag 
                size={48} 
                color="#b91c1c" 
                animateOnScroll={true}
                className="group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <H3 className="text-sm font-montserrat text-expedition-700">Summit Goal</H3>
          </div>
        </div>
      </section>

      {/* Training Progress Section */}
      <section className="py-16 space-y-12">
        <div className="text-center space-y-4">
          <H2>Training Progress</H2>
          <Body className="max-w-2xl mx-auto">
            Systematic preparation through data-driven training, comprehensive gear testing, 
            and methodical skill development toward the ultimate summit.
          </Body>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="elevated" padding="lg" className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="flex items-center justify-center w-16 h-16 bg-alpine-blue/10 rounded-full">
                <Icon name="Activity" size="xl" className="text-alpine-blue" />
              </div>
            </div>
            <div className="space-y-2">
              <Display>1,240</Display>
              <H3 className="text-spa-slate">Total Distance</H3>
              <Body className="text-sm">Kilometers trained this year</Body>
            </div>
          </Card>

          <Card variant="elevated" padding="lg" className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="flex items-center justify-center w-16 h-16 bg-summit-gold/10 rounded-full">
                <Icon name="Mountain" size="xl" className="text-summit-gold" />
              </div>
            </div>
            <div className="space-y-2">
              <Display>34,200</Display>
              <H3 className="text-spa-slate">Elevation Gained</H3>
              <Body className="text-sm">Meters climbed in preparation</Body>
            </div>
          </Card>

          <Card variant="elevated" padding="lg" className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                <Icon name="Calendar" size="xl" className="text-green-600" />
              </div>
            </div>
            <div className="space-y-2">
              <Display>156</Display>
              <H3 className="text-spa-slate">Training Days</H3>
              <Body className="text-sm">Consistent preparation sessions</Body>
            </div>
          </Card>
        </div>
      </section>

      {/* Latest Update Section */}
      <section className="py-16 space-y-8">
        <div className="text-center space-y-4">
          <H2>Latest Update</H2>
          <Body>Recent insights from the journey toward summit preparation</Body>
        </div>

        <Card variant="premium" padding="lg" className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <H3>Week 12: High-Altitude Simulation Training</H3>
                <div className="flex items-center space-x-4 text-sm text-spa-slate">
                  <span>December 14, 2024</span>
                  <span>•</span>
                  <span>Training Update</span>
                </div>
              </div>
              <StatusBadge variant="summit">Week 12 of 24</StatusBadge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <SeriaText>
              This week marked a significant milestone in our Everest preparation journey. 
              The combination of high-altitude training simulation and technical skill 
              development is building the foundation needed for the ultimate ascent.
            </SeriaText>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
              <div className="text-center space-y-2">
                <div className="font-semibold text-2xl text-alpine-blue">127km</div>
                <div className="text-sm text-spa-slate">Distance Covered</div>
              </div>
              <div className="text-center space-y-2">
                <div className="font-semibold text-2xl text-alpine-blue">2,840m</div>
                <div className="text-sm text-spa-slate">Elevation Gained</div>
              </div>
              <div className="text-center space-y-2">
                <div className="font-semibold text-2xl text-alpine-blue">18.5h</div>
                <div className="text-sm text-spa-slate">Training Duration</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <Button variant="primary">
                <Icon name="ExternalLink" size="sm" />
                Read Full Update
              </Button>
              <Button variant="ghost">
                <Icon name="Share2" size="sm" />
                Share Progress
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Community Support Section */}
      <section className="py-16 bg-spa-mist/30 rounded-2xl mx-4 space-y-8">
        <div className="text-center space-y-4">
          <H2>Community Support</H2>
          <BodyLarge className="max-w-2xl mx-auto">
            Join the journey and help make this Everest expedition possible through 
            community backing and shared adventure.
          </BodyLarge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto px-8">
          <Card variant="elevated" padding="lg" className="space-y-4">
            <div className="flex items-center space-x-3">
              <Icon name="Heart" className="text-red-500" size="lg" />
              <H3>Support the Journey</H3>
            </div>
            <Body>
              Help fund training, equipment, and expedition costs through direct support. 
              Every contribution brings us closer to the summit.
            </Body>
            <Button variant="summit" className="w-full" asChild>
              <a href="/support">
                <Icon name="Heart" size="sm" />
                Make a Contribution
              </a>
            </Button>
          </Card>

          <Card variant="elevated" padding="lg" className="space-y-4">
            <div className="flex items-center space-x-3">
              <Icon name="Mail" className="text-alpine-blue" size="lg" />
              <H3>Stay Connected</H3>
            </div>
            <Body>
              Get weekly training updates, behind-the-scenes insights, and expedition 
              progress delivered to your inbox.
            </Body>
            <Button variant="primary" className="w-full" asChild>
              <a href="/newsletter">
                <Icon name="Mail" size="sm" />
                Subscribe to Updates
              </a>
            </Button>
          </Card>
        </div>
      </section>
    </DefaultLayout>
  );
}
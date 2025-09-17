import React from 'react';
import { Button } from '../atoms/Button';
import {
  Eye,
  Download,
  Calendar,
  TrendingUp,
  Shield,
  Users,
} from 'lucide-react';

export const TransparencySection: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-white to-spa-mist">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center space-y-6 mb-16">
          <h2 className="font-sans font-normal text-4xl text-spa-charcoal leading-tight">
            Complete Financial Transparency
          </h2>
          <p className="font-sans text-xl leading-relaxed max-w-3xl mx-auto text-spa-slate">
            Every contribution is tracked, documented, and reported with
            complete transparency. See exactly how community support advances
            expedition preparation goals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Transparency Principles */}
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full flex-shrink-0">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-sans font-medium text-xl text-spa-charcoal mb-2">
                  Open Book Financial Reporting
                </h3>
                <p className="text-spa-slate leading-relaxed">
                  Monthly detailed reports show exactly how every dollar is
                  invested in expedition preparation. No hidden costs, no
                  administrative fees - 100% of contributions go directly to
                  expedition goals.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full flex-shrink-0">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-sans font-medium text-xl text-spa-charcoal mb-2">
                  Real-Time Funding Progress
                </h3>
                <p className="text-spa-slate leading-relaxed">
                  Live dashboard updates show funding progress toward expedition
                  milestones. Track how the community collectively advances
                  preparation goals with measurable impact.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full flex-shrink-0">
                <Download className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-sans font-medium text-xl text-spa-charcoal mb-2">
                  Downloadable Financial Reports
                </h3>
                <p className="text-spa-slate leading-relaxed">
                  Complete financial documentation available for download
                  including expense receipts, impact summaries, and expedition
                  cost breakdowns for full accountability.
                </p>
              </div>
            </div>
          </div>

          {/* Current Funding Status */}
          <div className="bg-white rounded-2xl p-8 shadow-spa-elevated border border-spa-cloud">
            <h3 className="font-sans font-medium text-2xl text-spa-charcoal mb-6">
              Current Funding Status
            </h3>

            {/* Overall Progress */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between">
                <span className="text-spa-slate">Total Expedition Goal</span>
                <span className="text-2xl font-bold text-spa-charcoal">
                  $30,200
                </span>
              </div>

              <div className="w-full bg-spa-mist rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-alpine-blue to-summit-gold h-4 rounded-full"
                  style={{ width: '34%' }}
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-spa-slate">$10,268 raised</span>
                <span className="text-spa-slate">34% complete</span>
              </div>
            </div>

            {/* Milestone Breakdown */}
            <div className="space-y-4">
              <h4 className="font-medium text-spa-charcoal text-sm uppercase tracking-wide">
                Funding Milestones
              </h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">
                      Safety Equipment
                    </span>
                  </div>
                  <span className="text-green-600 font-bold">✓ Funded</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">
                      Training Program
                    </span>
                  </div>
                  <span className="text-blue-600 font-bold">67% Funded</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-spa-mist rounded-lg border border-spa-cloud">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-spa-slate" />
                    <span className="font-medium text-spa-charcoal">
                      Climbing Permit
                    </span>
                  </div>
                  <span className="text-spa-slate">Next Goal</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Reports Section */}
        <div className="bg-white rounded-2xl p-8 shadow-spa-elevated border border-spa-cloud">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h3 className="font-sans font-medium text-2xl text-spa-charcoal">
                Monthly Financial Reports
              </h3>

              <p className="text-spa-slate leading-relaxed">
                Access detailed monthly reports showing exactly how community
                contributions advance expedition preparation. Each report
                includes expense documentation, impact analysis, and progress
                toward funding milestones.
              </p>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-spa-slate">
                    Detailed expense breakdown
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-spa-slate">
                    Impact measurement documentation
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-spa-slate">
                    Progress photos and updates
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm text-spa-slate">
                    Community acknowledgments
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-spa-mist rounded-lg">
                <div>
                  <div className="font-medium text-spa-charcoal">
                    November 2024 Report
                  </div>
                  <div className="text-sm text-spa-slate">
                    Training equipment & preparation
                  </div>
                </div>
                <Button variant="secondary" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-spa-mist rounded-lg">
                <div>
                  <div className="font-medium text-spa-charcoal">
                    October 2024 Report
                  </div>
                  <div className="text-sm text-spa-slate">
                    Gear acquisition & testing
                  </div>
                </div>
                <Button variant="secondary" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-spa-mist rounded-lg">
                <div>
                  <div className="font-medium text-spa-charcoal">
                    September 2024 Report
                  </div>
                  <div className="text-sm text-spa-slate">
                    Training program launch
                  </div>
                </div>
                <Button variant="secondary" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>

              <Button variant="ghost" className="w-full">
                View All Financial Reports
              </Button>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center mt-16">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-spa-slate">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Secure Payment Processing</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-blue-600" />
              <span>100% Financial Transparency</span>
            </div>
            <div className="flex items-center space-x-2">
              <Download className="h-4 w-4 text-purple-600" />
              <span>Tax Receipts Provided</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-amber-600" />
              <span>Community Verified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

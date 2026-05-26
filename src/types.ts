/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface College {
  id: string;
  name: string;
  admissionStatus: string;
  admissionStartDate: string;
  region: 'South' | 'East' | 'West' | 'North';
  state: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  mapUrl: string;
  programsCount: number;
  learnerIntake: number;
  brochureLink: string;
  campusVideo: string;
  registrationFee: string;
  bridgeFee: string;
  programFee: string; // original description (e.g., "AHP - 7.2L")
  annualFee: number; // calculated annual fee in Lakhs INR (e.g. 1.8)
  totalProgramFee: number; // calculated approximate total course fee (e.g. 7.2)
  paymentLink: string;
  paymentCycle: string;
  naacGrading: string;
  duration: string;
  eligibility: string;
  programsList: string[]; // listed offerings
  universityOwner: string;
  campusManager: string;
  hostelAvailable: string;
  amenity: string;
  transportation: string;
  roi: string;
  avgPlacementPackage: number; // calculated in LPA (e.g., 5.5)
  uniquePoints: string;
  paymentBankDetails?: string;
  scholarshipDetails?: string;
  loanDetails?: string;
  fstStaff?: string;
  ismManager?: string;
  // Deep details from main.csv
  ageCriteriaAndCareerGap?: string;
  yearOnYearFees?: string;
  remarksAdditionalDetails?: string;
  tokenFeesRefundStatus?: string;
  officeTiming?: string;
  batchStart?: string;
  founders?: string;
  universityWebsiteLink?: string;
  emversityWebsiteLink?: string;
  bridgeFeeMandatory?: string;
  internshipSupport?: string;
}

export interface GeocodedLocation {
  name: string;
  lat: number;
  lng: number;
  type: 'city' | 'pincode' | 'custom';
  pincode?: string;
}

export interface SearchCriteria {
  searchTerm: string;
  region: string;
  state: string;
  admissionStatus: string;
  maxAnnualFee: number;
  naacGrading: string;
  programType: string;
}

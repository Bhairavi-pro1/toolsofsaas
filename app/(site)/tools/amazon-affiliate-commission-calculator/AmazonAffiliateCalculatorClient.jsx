'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import AdBanner from '@/components/AdBanner';
import './amazon-affiliate-calculator.css';

// 21+ Official Amazon Storefronts with Regional Mapping
const STOREFRONTS = [
  { id: 'US', label: 'United States (.com)', code: 'USD', symbol: '$', defaultRegion: 'US' },
  { id: 'IN', label: 'India (.in)', code: 'INR', symbol: '₹', defaultRegion: 'IN' },
  { id: 'UK', label: 'United Kingdom (.co.uk)', code: 'GBP', symbol: '£', defaultRegion: 'UK' },
  { id: 'DE', label: 'Germany (.de)', code: 'EUR', symbol: '€', defaultRegion: 'EU' },
  { id: 'CA', label: 'Canada (.ca)', code: 'CAD', symbol: 'CA$', defaultRegion: 'CA' },
  { id: 'JP', label: 'Japan (.co.jp)', code: 'JPY', symbol: '¥', defaultRegion: 'JP' },
  { id: 'AU', label: 'Australia (.com.au)', code: 'AUD', symbol: 'A$', defaultRegion: 'DEFAULT' },
  { id: 'FR', label: 'France (.fr)', code: 'EUR', symbol: '€', defaultRegion: 'EU' },
  { id: 'IT', label: 'Italy (.it)', code: 'EUR', symbol: '€', defaultRegion: 'EU' },
  { id: 'ES', label: 'Spain (.es)', code: 'EUR', symbol: '€', defaultRegion: 'EU' },
  { id: 'NL', label: 'Netherlands (.nl)', code: 'EUR', symbol: '€', defaultRegion: 'EU' },
  { id: 'BE', label: 'Belgium (.com.be)', code: 'EUR', symbol: '€', defaultRegion: 'EU' },
  { id: 'IE', label: 'Ireland (.ie)', code: 'EUR', symbol: '€', defaultRegion: 'UK' },
  { id: 'BR', label: 'Brazil (.com.br)', code: 'BRL', symbol: 'R$', defaultRegion: 'DEFAULT' },
  { id: 'MX', label: 'Mexico (.com.mx)', code: 'MXN', symbol: 'Mex$', defaultRegion: 'DEFAULT' },
  { id: 'AE', label: 'UAE (.ae)', code: 'AED', symbol: 'AED', defaultRegion: 'DEFAULT' },
  { id: 'SA', label: 'Saudi Arabia (.sa)', code: 'SAR', symbol: 'SR', defaultRegion: 'DEFAULT' },
  { id: 'SE', label: 'Sweden (.se)', code: 'SEK', symbol: 'kr', defaultRegion: 'EU' },
  { id: 'PL', label: 'Poland (.pl)', code: 'PLN', symbol: 'zł', defaultRegion: 'EU' },
  { id: 'TR', label: 'Turkey (.com.tr)', code: 'TRY', symbol: '₺', defaultRegion: 'DEFAULT' },
  { id: 'SG', label: 'Singapore (.sg)', code: 'SGD', symbol: 'S$', defaultRegion: 'DEFAULT' },
  { id: 'EG', label: 'Egypt (.eg)', code: 'EGP', symbol: 'E£', defaultRegion: 'DEFAULT' },
  { id: 'ZA', label: 'South Africa (.co.za)', code: 'ZAR', symbol: 'R', defaultRegion: 'DEFAULT' },
  { id: 'CUSTOM', label: 'Other / Custom Storefront', code: 'USD', symbol: '$', defaultRegion: 'US' },
];

// Official Category Commission Rates by Storefront Region
const STOREFRONT_CATEGORIES = {
  US: [
    { value: '20.0', label: 'Amazon Games (20.0%)' },
    { value: '10.0', label: 'Luxury Beauty & Amazon Coins (10.0%)' },
    { value: '7.0', label: 'Amazon Haul (7.0%)' },
    { value: '5.0', label: 'Digital Music, Physical Music, Video (5.0%)' },
    { value: '4.5', label: 'Books, Outdoors, Tools, Kitchen, Auto (4.5%)' },
    { value: '4.0', label: 'Amazon Devices, Apparel, Beauty, Home (4.0%)' },
    { value: '3.0', label: 'Toys, Baby, Pet Products, Sports (3.0%)' },
    { value: '2.5', label: 'PC, Laptops, Components (2.5%)' },
    { value: '2.0', label: 'Video Games, Consoles, TVs (2.0%)' },
    { value: '1.0', label: 'Grocery, Health & Personal Care (1.0%)' },
    { value: '0.0', label: 'Gift Cards, Gold & Excluded (0.0%)' },
    { value: 'CUSTOM', label: 'Custom Percentage Rate...' },
  ],
  IN: [
    { value: '9.0', label: 'Apparel, Accessories, Luggage, Watches, Beauty (9.0%)' },
    { value: '7.0', label: 'Shoes and Handbags (7.0%)' },
    { value: '6.0', label: 'Kitchenware, Appliances, Homeware (6.0%)' },
    { value: '5.0', label: 'Books, Toys, Baby, Sports & Fitness, Auto (5.0%)' },
    { value: '4.5', label: 'Furniture, Pet Supplies, Health & Personal Care (4.5%)' },
    { value: '4.0', label: 'Mobile Accessories & Wireless Gear (4.0%)' },
    { value: '3.5', label: 'Grocery & Amazon Fresh (3.5%)' },
    { value: '2.5', label: 'Large Appliances, Computers, TVs, Electronics (2.5%)' },
    { value: '1.0', label: 'Mobile Phones / Smartphones (1.0%)' },
    { value: '0.0', label: 'Gift Cards, Gold/Silver Coins, Prime (0.0%)' },
    { value: 'CUSTOM', label: 'Custom Percentage Rate...' },
  ],
  UK: [
    { value: '20.0', label: 'Amazon Games (20.0%)' },
    { value: '10.0', label: 'Amazon Fashion, Apparel, Shoes, Jewelry (10.0%)' },
    { value: '7.0', label: 'Home, Furniture, Kitchen, Luggage (7.0%)' },
    { value: '6.0', label: 'Automotive, DIY, Tools, Beauty, Musical (6.0%)' },
    { value: '5.0', label: 'Books, Kindle Devices, Paperbacks (5.0%)' },
    { value: '5.0', label: 'Sports, Toys, Pet Supplies (5.0%)' },
    { value: '2.5', label: 'Consumer Electronics, PC, Tablets (2.5%)' },
    { value: '1.5', label: 'Video Games & Consoles (1.5%)' },
    { value: '1.5', label: 'Grocery & Pantry (1.5%)' },
    { value: '0.0', label: 'Gift Cards & Excluded Tiers (0.0%)' },
    { value: 'CUSTOM', label: 'Custom Percentage Rate...' },
  ],
  EU: [
    { value: '10.0', label: 'Fashion, Shoes, Jewellery, Luggage (10.0%)' },
    { value: '7.0', label: 'Home, Kitchen, Furniture, Garden (7.0%)' },
    { value: '6.0', label: 'Automotive, Beauty, Sports & Outdoors (6.0%)' },
    { value: '5.0', label: 'Books, Kindle E-Books (5.0%)' },
    { value: '3.0', label: 'Toys, Baby, Pet Supplies (3.0%)' },
    { value: '2.5', label: 'Consumer Electronics, Computers (2.5%)' },
    { value: '2.0', label: 'Televisions, Home Cinema (2.0%)' },
    { value: '1.5', label: 'Video Games & Consoles (1.5%)' },
    { value: '1.0', label: 'Grocery & Health (1.0%)' },
    { value: '0.0', label: 'Gift Cards & Excluded Tiers (0.0%)' },
    { value: 'CUSTOM', label: 'Custom Percentage Rate...' },
  ],
  CA: [
    { value: '10.0', label: 'Luxury Beauty & Amazon Coins (10.0%)' },
    { value: '8.0', label: 'Apparel, Shoes, Watches, Jewelry (8.0%)' },
    { value: '5.0', label: 'Home, Kitchen, Tools, Outdoors (5.0%)' },
    { value: '5.0', label: 'Books, Music, DVDs (5.0%)' },
    { value: '4.0', label: 'Sports, Toys, Baby, Pet Products (4.0%)' },
    { value: '2.5', label: 'Electronics, PCs, Tablets (2.5%)' },
    { value: '2.0', label: 'Televisions & Video Games (2.0%)' },
    { value: '1.0', label: 'Grocery & Health (1.0%)' },
    { value: '0.0', label: 'Gift Cards & Excluded Tiers (0.0%)' },
    { value: 'CUSTOM', label: 'Custom Percentage Rate...' },
  ],
  JP: [
    { value: '8.0', label: 'Amazon Fashion, Apparel & Shoes (8.0%)' },
    { value: '8.0', label: 'Food, Beverage, Alcohol (8.0%)' },
    { value: '5.0', label: 'Cosmetics, Health & Beauty (5.0%)' },
    { value: '3.0', label: 'Books, Kindle Books (3.0%)' },
    { value: '3.0', label: 'Kitchen, Daily Necessities, Pet (3.0%)' },
    { value: '2.0', label: 'Electronics, PC, Home Appliances (2.0%)' },
    { value: '2.0', label: 'Video Games & Consoles (2.0%)' },
    { value: '0.0', label: 'Gift Cards & Excluded Tiers (0.0%)' },
    { value: 'CUSTOM', label: 'Custom Percentage Rate...' },
  ],
  DEFAULT: [
    { value: '10.0', label: 'High-Yield Fashion, Luxury & Games (10.0%)' },
    { value: '5.0', label: 'Home, Kitchen, Tools, Automotive (5.0%)' },
    { value: '4.5', label: 'Books, Media & Educational (4.5%)' },
    { value: '3.5', label: 'Sports, Toys, Baby, Pet Products (3.5%)' },
    { value: '2.5', label: 'Computers, Electronics, Mobile Accessories (2.5%)' },
    { value: '2.0', label: 'Consoles & TVs (2.0%)' },
    { value: '1.5', label: 'Grocery & Consumables (1.5%)' },
    { value: '0.0', label: 'Gift Cards & Excluded Tiers (0.0%)' },
    { value: 'CUSTOM', label: 'Custom Percentage Rate...' },
  ],
};

// International Standard Currency Symbols (ISO 4217 & Unicode CLDR)
const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  CAD: 'CA$',
  AUD: 'A$',
  JPY: '¥',
  MXN: 'Mex$',
  BRL: 'R$',
  SGD: 'S$',
  NZD: 'NZ$',
  AED: 'AED',
  SAR: 'SR',
  EGP: 'E£',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
  PLN: 'zł',
  TRY: '₺',
  ZAR: 'R',
  PHP: '₱',
  PKR: 'Rs',
  BDT: '৳',
  IDR: 'Rp',
  VND: '₫',
  THB: '฿',
  MYR: 'RM',
  NGN: '₦',
  KES: 'KSh',
  CHF: 'CHF',
  ILS: '₪',
  KRW: '₩',
  HKD: 'HK$',
  TWD: 'NT$',
  CZK: 'Kč',
  HUF: 'Ft',
  RON: 'lei',
  CLP: 'CLP$',
  COP: 'COL$',
  ARS: 'AR$',
  PEN: 'S/.',
};

// 40+ Popular Target Home Payout Currencies with Standard Disambiguated Symbols
const TARGET_CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'INR (₹) - Indian Rupee' },
  { code: 'USD', symbol: '$', label: 'USD ($) - US Dollar' },
  { code: 'EUR', symbol: '€', label: 'EUR (€) - Euro' },
  { code: 'GBP', symbol: '£', label: 'GBP (£) - British Pound' },
  { code: 'CAD', symbol: 'CA$', label: 'CAD (CA$) - Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', label: 'AUD (A$) - Australian Dollar' },
  { code: 'JPY', symbol: '¥', label: 'JPY (¥) - Japanese Yen' },
  { code: 'BRL', symbol: 'R$', label: 'BRL (R$) - Brazilian Real' },
  { code: 'MXN', symbol: 'Mex$', label: 'MXN (Mex$) - Mexican Peso' },
  { code: 'SGD', symbol: 'S$', label: 'SGD (S$) - Singapore Dollar' },
  { code: 'NZD', symbol: 'NZ$', label: 'NZD (NZ$) - New Zealand Dollar' },
  { code: 'AED', symbol: 'AED', label: 'AED (AED) - UAE Dirham' },
  { code: 'SAR', symbol: 'SR', label: 'SAR (SR) - Saudi Riyal' },
  { code: 'EGP', symbol: 'E£', label: 'EGP (E£) - Egyptian Pound' },
  { code: 'SEK', symbol: 'kr', label: 'SEK (kr) - Swedish Krona' },
  { code: 'NOK', symbol: 'kr', label: 'NOK (kr) - Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', label: 'DKK (kr) - Danish Krone' },
  { code: 'PLN', symbol: 'zł', label: 'PLN (zł) - Polish Zloty' },
  { code: 'TRY', symbol: '₺', label: 'TRY (₺) - Turkish Lira' },
  { code: 'ZAR', symbol: 'R', label: 'ZAR (R) - South African Rand' },
  { code: 'PHP', symbol: '₱', label: 'PHP (₱) - Philippine Peso' },
  { code: 'PKR', symbol: 'Rs', label: 'PKR (Rs) - Pakistani Rupee' },
  { code: 'BDT', symbol: '৳', label: 'BDT (৳) - Bangladeshi Taka' },
  { code: 'IDR', symbol: 'Rp', label: 'IDR (Rp) - Indonesian Rupiah' },
  { code: 'VND', symbol: '₫', label: 'VND (₫) - Vietnamese Dong' },
  { code: 'THB', symbol: '฿', label: 'THB (฿) - Thai Baht' },
  { code: 'MYR', symbol: 'RM', label: 'MYR (RM) - Malaysian Ringgit' },
  { code: 'NGN', symbol: '₦', label: 'NGN (₦) - Nigerian Naira' },
  { code: 'KES', symbol: 'KSh', label: 'KES (KSh) - Kenyan Shilling' },
  { code: 'CHF', symbol: 'CHF', label: 'CHF (CHF) - Swiss Franc' },
  { code: 'ILS', symbol: '₪', label: 'ILS (₪) - Israeli New Shekel' },
  { code: 'KRW', symbol: '₩', label: 'KRW (₩) - South Korean Won' },
  { code: 'HKD', symbol: 'HK$', label: 'HKD (HK$) - Hong Kong Dollar' },
  { code: 'TWD', symbol: 'NT$', label: 'TWD (NT$) - New Taiwan Dollar' },
  { code: 'CZK', symbol: 'Kč', label: 'CZK (Kč) - Czech Koruna' },
  { code: 'HUF', symbol: 'Ft', label: 'HUF (Ft) - Hungarian Forint' },
  { code: 'RON', symbol: 'lei', label: 'RON (lei) - Romanian Leu' },
  { code: 'CLP', symbol: 'CLP$', label: 'CLP (CLP$) - Chilean Peso' },
  { code: 'COP', symbol: 'COL$', label: 'COP (COL$) - Colombian Peso' },
  { code: 'ARS', symbol: 'AR$', label: 'ARS (AR$) - Argentine Peso' },
  { code: 'PEN', symbol: 'S/.', label: 'PEN (S/.) - Peruvian Sol' },
  { code: 'CUSTOM', symbol: '', label: 'Other / Type Custom ISO Code...' },
];

export default function AmazonAffiliateCalculatorClient() {
  // Storefront & Currency State
  const [storefrontId, setStorefrontId] = useState('US');
  const [customStorefrontSymbol, setCustomStorefrontSymbol] = useState('$');
  const [targetCurrencyCode, setTargetCurrencyCode] = useState('INR');
  const [customTargetCode, setCustomTargetCode] = useState('INR');

  // Rate State (Non-editable, Read-only display, refreshed via API)
  const [exchangeRate, setExchangeRate] = useState(83.5);
  const [rateStatus, setRateStatus] = useState('Rates Live');
  const [ratePulseColor, setRatePulseColor] = useState('normal'); // 'normal', 'warning', 'error'
  const [isRefreshingRate, setIsRefreshingRate] = useState(false);

  // Category & Commission State
  const [categoryPreset, setCategoryPreset] = useState('4.5');
  const [commissionRate, setCommissionRate] = useState(4.5);

  // Input & Calculation State
  const [bulkPrices, setBulkPrices] = useState('');
  const [calculatedData, setCalculatedData] = useState(null);

  // Toast State
  const [toast, setToast] = useState({ show: false, message: '', isError: false });

  // Terms & Conditions / Approximate Estimation Modal State
  const [showTermsModal, setShowTermsModal] = useState(true);

  // Check acceptance on mount
  useEffect(() => {
    try {
      const accepted = sessionStorage.getItem('amz_calc_terms_accepted');
      if (accepted === 'true') {
        setShowTermsModal(false);
      } else {
        setShowTermsModal(true);
      }
    } catch {
      setShowTermsModal(true);
    }
  }, []);

  // Prevent background scrolling when modal is active
  useEffect(() => {
    if (showTermsModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showTermsModal]);

  const handleAcceptTerms = () => {
    try {
      sessionStorage.setItem('amz_calc_terms_accepted', 'true');
    } catch {
      // Ignore storage errors
    }
    setShowTermsModal(false);
  };

  // Get Active Storefront Object
  const currentStorefront = useMemo(() => {
    return STOREFRONTS.find((s) => s.id === storefrontId) || STOREFRONTS[0];
  }, [storefrontId]);

  // Active Category Presets based on Storefront Region
  const activeCategoryPresets = useMemo(() => {
    const region = currentStorefront.defaultRegion || 'US';
    return STOREFRONT_CATEGORIES[region] || STOREFRONT_CATEGORIES.DEFAULT;
  }, [currentStorefront]);

  const activeSymbol = useMemo(() => {
    if (storefrontId === 'CUSTOM') {
      return customStorefrontSymbol.trim() || '$';
    }
    return currentStorefront.symbol;
  }, [storefrontId, customStorefrontSymbol, currentStorefront]);

  const activeBaseCode = useMemo(() => {
    if (storefrontId === 'CUSTOM') return 'USD';
    return currentStorefront.code;
  }, [storefrontId, currentStorefront]);

  const activeTargetCode = useMemo(() => {
    if (targetCurrencyCode === 'CUSTOM') {
      return (customTargetCode.trim() || 'INR').toUpperCase();
    }
    return targetCurrencyCode;
  }, [targetCurrencyCode, customTargetCode]);

  const activeTargetSymbol = useMemo(() => {
    if (targetCurrencyCode === 'CUSTOM') {
      const code = (customTargetCode.trim() || 'INR').toUpperCase();
      return CURRENCY_SYMBOLS[code] || code;
    }
    const found = TARGET_CURRENCIES.find((t) => t.code === targetCurrencyCode);
    return found?.symbol || CURRENCY_SYMBOLS[targetCurrencyCode] || targetCurrencyCode;
  }, [targetCurrencyCode, customTargetCode]);

  // Toast Helper
  const showToast = useCallback((msg, isError = false) => {
    setToast({ show: true, message: msg, isError });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3200);
  }, []);

  // Live Exchange Rate Fetcher
  const fetchExchangeRate = useCallback(async (isManualRefresh = false) => {
    const base = activeBaseCode;
    const target = activeTargetCode;

    setIsRefreshingRate(true);
    setRateStatus(`Fetching rate (${base} → ${target})...`);
    setRatePulseColor('warning');

    try {
      // Primary Endpoint
      let response = await fetch(`https://open.er-api.com/v6/latest/${base}`);
      let data = await response.json();

      if (!data || data.result !== 'success' || !data.rates || !data.rates[target]) {
        // Fallback Endpoint
        response = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`);
        data = await response.json();
      }

      if (data && data.rates && data.rates[target]) {
        const rate = parseFloat(data.rates[target]);
        const roundedRate = parseFloat(rate.toFixed(4));
        setExchangeRate(roundedRate);
        setRateStatus('Rates Live');
        setRatePulseColor('normal');
        if (isManualRefresh) {
          showToast(`Live exchange rate fetched: 1 ${base} = ${roundedRate} ${target}`);
        }
      } else {
        throw new Error('Rate unavailable');
      }
    } catch {
      setRateStatus('Live Rate Offline');
      setRatePulseColor('warning');
      showToast(`Could not fetch live rate for ${target}. You can enter a custom rate manually.`, true);
    } finally {
      setIsRefreshingRate(false);
    }
  }, [activeBaseCode, activeTargetCode, showToast]);

  // Handle Manual Exchange Rate Editing
  const handleExchangeRateChange = (e) => {
    setExchangeRate(e.target.value);
    setRateStatus('Custom Rate Active');
    setRatePulseColor('warning');
  };

  // Clean Storefront Country Label (avoids "United Tiers" bug)
  const storefrontCountryLabel = useMemo(() => {
    if (currentStorefront.id === 'US') return 'US';
    if (currentStorefront.id === 'UK') return 'UK';
    return currentStorefront.label.replace(/\s*\(.*\)/, '').trim();
  }, [currentStorefront]);

  // Fetch rate on storefront or target currency change
  useEffect(() => {
    fetchExchangeRate();
  }, [storefrontId, targetCurrencyCode, customTargetCode, fetchExchangeRate]);

  // When storefront changes, automatically update categories to that country's official tiers
  const handleStorefrontChange = (e) => {
    const newStorefrontId = e.target.value;
    e.target.blur();
    setStorefrontId(newStorefrontId);

    const sf = STOREFRONTS.find((s) => s.id === newStorefrontId) || STOREFRONTS[0];
    const region = sf.defaultRegion || 'US';
    const presets = STOREFRONT_CATEGORIES[region] || STOREFRONT_CATEGORIES.DEFAULT;

    // Default to the most common tier for that region (or Books 4.5% / Apparel 9% / 10%)
    const defaultTier = presets.find((p) => p.value === '4.5') || presets[0];
    setCategoryPreset(defaultTier.value);
    setCommissionRate(parseFloat(defaultTier.value) || 0);
  };

  // Parse raw price input into array of valid positive numbers
  const parsePrices = useCallback((rawText) => {
    if (!rawText) return [];
    const matches = rawText.match(/[-+]?[0-9]*\.?[0-9]+/g);
    if (!matches) return [];
    return matches.map((val) => parseFloat(val)).filter((val) => !isNaN(val) && val >= 0);
  }, []);

  // Format currency numbers cleanly according to international standards
  const formatMoney = useCallback((amount, symbol = '', decimals = 2) => {
    const formatted = amount.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    if (!symbol) return formatted;
    // Add space if symbol has Latin letters (e.g. Mex$, CA$, A$, S$, NZ$, R$, SR, E£, AED, kr, zł, CHF)
    const needsSpace = /[a-zA-Z]/.test(symbol);
    return needsSpace ? `${symbol} ${formatted}` : `${symbol}${formatted}`;
  }, []);

  // Core Calculation Function
  const calculateCommission = useCallback(
    (showSuccessToast = false) => {
      const prices = parsePrices(bulkPrices);

      if (prices.length === 0) {
        if (showSuccessToast) showToast('Please enter valid numeric item prices.', true);
        setCalculatedData(null);
        return;
      }

      const ratePct = parseFloat(commissionRate) || 0;
      const exRate = parseFloat(exchangeRate) || 1;

      let grossSales = 0;
      let storefrontYield = 0;
      let totalLocalConvertedSales = 0;
      const lineItems = [];

      prices.forEach((price, index) => {
        const localConvertedPrice = price * exRate;
        const itemYield = price * (ratePct / 100);
        const targetPayout = itemYield * exRate;

        grossSales += price;
        storefrontYield += itemYield;
        totalLocalConvertedSales += localConvertedPrice;

        lineItems.push({
          id: index + 1,
          price,
          localConvertedPrice,
          yieldRate: ratePct,
          targetPayout,
        });
      });

      const totalTargetPayout = storefrontYield * exRate;

      setCalculatedData({
        itemCount: prices.length,
        grossSales,
        totalLocalConvertedSales,
        totalTargetPayout,
        commissionRate: ratePct,
        exchangeRate: exRate,
        lineItems,
        baseCode: activeBaseCode,
        targetCode: activeTargetCode,
        symbol: activeSymbol,
        targetSymbol: activeTargetSymbol,
      });

      if (showSuccessToast) {
        showToast('Commission calculated successfully!');
      }
    },
    [bulkPrices, commissionRate, exchangeRate, activeBaseCode, activeTargetCode, activeSymbol, activeTargetSymbol, parsePrices, showToast]
  );

  // Auto recalculate when active calculations already exist and inputs change
  useEffect(() => {
    if (calculatedData) {
      calculateCommission(false);
    }
  }, [commissionRate, exchangeRate, activeSymbol, activeTargetCode, activeTargetSymbol, calculateCommission]);

  // Handle Category Preset Change
  const handleCategoryPresetChange = (e) => {
    const val = e.target.value;
    e.target.blur();
    setCategoryPreset(val);
    if (val !== 'CUSTOM') {
      setCommissionRate(parseFloat(val));
    }
  };

  // Handle Manual Commission Rate Change
  const handleCommissionRateChange = (e) => {
    const val = e.target.value;
    setCommissionRate(val);
    const matched = activeCategoryPresets.some((item) => item.value === String(val));
    if (matched) {
      setCategoryPreset(String(val));
    } else {
      setCategoryPreset('CUSTOM');
    }
  };

  // Sample Data Loader
  const handleLoadSample = () => {
    setBulkPrices('100\n300\n200\n250\n150');
    showToast('Sample dataset loaded.');
    setTimeout(() => {
      calculateCommission(true);
    }, 50);
  };

  // Reset / Clear Form
  const handleClear = () => {
    setBulkPrices('');
    setCalculatedData(null);
    showToast('Form cleared.');
  };

  // Copy Summary to Clipboard
  const handleCopySummary = async () => {
    if (!calculatedData) {
      showToast('Calculate commissions before copying!', true);
      return;
    }

    const summaryText = `--- Amazon Affiliate Commission Summary ---
Storefront: ${currentStorefront.label} (${calculatedData.baseCode})
Processed Items: ${calculatedData.itemCount}
Commission Rate: ${calculatedData.commissionRate}%
Gross Sales: ${formatMoney(calculatedData.grossSales, calculatedData.symbol)}
Total Local Sales: ${formatMoney(calculatedData.totalLocalConvertedSales, calculatedData.targetSymbol)} (${calculatedData.targetCode})
Net Target Payout: ${formatMoney(calculatedData.totalTargetPayout, calculatedData.targetSymbol)} (${calculatedData.targetCode})
Exchange Rate: 1 ${calculatedData.baseCode} = ${calculatedData.exchangeRate} ${calculatedData.targetCode}

Calculated via ToolsOfSaaS.com:
https://toolsofsaas.com/tools/amazon-affiliate-commission-calculator
`;

    try {
      await navigator.clipboard.writeText(summaryText);
      showToast('Summary copied to clipboard!');
    } catch {
      showToast('Failed to copy summary to clipboard.', true);
    }
  };

  // Copy TSV & Formatted HTML with Watermark for Excel / Google Sheets
  const handleCopyExcel = async () => {
    if (!calculatedData || calculatedData.lineItems.length === 0) {
      showToast('Calculate commissions before copying table!', true);
      return;
    }

    const targetHeader =
      calculatedData.targetSymbol && calculatedData.targetSymbol !== calculatedData.targetCode
        ? `${calculatedData.targetSymbol} (${calculatedData.targetCode})`
        : calculatedData.targetCode;

    const headers = [
      'Item #',
      `Price (${calculatedData.symbol})`,
      `Local Converted (${targetHeader})`,
      'Rate (%)',
      `Commission Payout (${targetHeader})`,
    ];

    const dataRows = calculatedData.lineItems.map((item) => [
      item.id,
      formatMoney(item.price, calculatedData.symbol),
      formatMoney(item.localConvertedPrice, calculatedData.targetSymbol),
      `${item.yieldRate.toFixed(2)}%`,
      formatMoney(item.targetPayout, calculatedData.targetSymbol),
    ]);

    const totalRow = [
      'TOTAL',
      formatMoney(calculatedData.grossSales, calculatedData.symbol),
      formatMoney(calculatedData.totalLocalConvertedSales, calculatedData.targetSymbol),
      '-',
      formatMoney(calculatedData.totalTargetPayout, calculatedData.targetSymbol),
    ];

    // Rich HTML Table for Excel (preserves perfect alignment, styling, and watermark)
    const htmlTable = `
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; font-family: Calibri, Arial, sans-serif;">
        <thead>
          <tr style="background-color: #0F172A;">
            <th colspan="5" style="text-align: center; font-size: 14pt; padding: 10px; background-color: #0F172A; color: #FF9900; font-weight: bold;">
              ToolsOfSaaS.com — Amazon Affiliate Commission Calculator
            </th>
          </tr>
          <tr style="background-color: #1E293B;">
            <th colspan="5" style="text-align: center; font-size: 9.5pt; padding: 6px; background-color: #1E293B; color: #CBD5E1; font-weight: normal;">
              Source: https://toolsofsaas.com/tools/amazon-affiliate-commission-calculator | Storefront: ${currentStorefront.label} | Rate: 1 ${calculatedData.baseCode} = ${calculatedData.exchangeRate} ${calculatedData.targetCode}
            </th>
          </tr>
          <tr style="background-color: #F1F5F9; font-weight: bold; color: #0F172A;">
            <th style="text-align: center; padding: 8px;">Item #</th>
            <th style="text-align: right; padding: 8px;">Price (${calculatedData.symbol})</th>
            <th style="text-align: right; padding: 8px;">Local Converted (${targetHeader})</th>
            <th style="text-align: center; padding: 8px;">Rate (%)</th>
            <th style="text-align: right; padding: 8px;">Commission Payout (${targetHeader})</th>
          </tr>
        </thead>
        <tbody>
          ${dataRows
            .map(
              (r) => `
            <tr>
              <td style="text-align: center; padding: 6px;">${r[0]}</td>
              <td style="text-align: right; padding: 6px;">${r[1]}</td>
              <td style="text-align: right; padding: 6px;">${r[2]}</td>
              <td style="text-align: center; padding: 6px;">${r[3]}</td>
              <td style="text-align: right; padding: 6px; font-weight: bold; color: #059669;">${r[4]}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
        <tfoot>
          <tr style="background-color: #F8FAFC; font-weight: bold; border-top: 2px solid #0F172A;">
            <td style="text-align: center; padding: 8px; color: #D97706;">${totalRow[0]}</td>
            <td style="text-align: right; padding: 8px;">${totalRow[1]}</td>
            <td style="text-align: right; padding: 8px;">${totalRow[2]}</td>
            <td style="text-align: center; padding: 8px;">${totalRow[3]}</td>
            <td style="text-align: right; padding: 8px; color: #059669; font-size: 11pt;">${totalRow[4]}</td>
          </tr>
          <tr>
            <td colspan="5" style="text-align: center; padding: 8px; font-size: 9pt; color: #64748B; font-style: italic; background-color: #F8FAFC;">
              Watermark: Calculated on ToolsOfSaaS.com — 100% Free Web Tools & SaaS Calculators
            </td>
          </tr>
        </tfoot>
      </table>
    `;

    // Plaintext TSV with standard Windows Excel CRLF and watermark
    const tsvLines = [
      `ToolsOfSaaS.com — Amazon Affiliate Commission Calculator\t\t\t\t`,
      `Source: https://toolsofsaas.com/tools/amazon-affiliate-commission-calculator\tStorefront: ${currentStorefront.label}\tRate: 1 ${calculatedData.baseCode} = ${calculatedData.exchangeRate} ${calculatedData.targetCode}\t\t`,
      ``,
      headers.join('\t'),
      ...dataRows.map((r) => r.join('\t')),
      totalRow.join('\t'),
      ``,
      `Watermark: Calculated on ToolsOfSaaS.com | Free SaaS & Web Utilities\t\t\t\t`,
    ];
    const tsvContent = tsvLines.join('\r\n');

    try {
      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard && navigator.clipboard.write) {
        const textBlob = new Blob([tsvContent], { type: 'text/plain' });
        const htmlBlob = new Blob([htmlTable], { type: 'text/html' });
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/plain': textBlob,
            'text/html': htmlBlob,
          }),
        ]);
      } else {
        await navigator.clipboard.writeText(tsvContent);
      }
      showToast('Aligned table with ToolsOfSaaS watermark copied!');
    } catch {
      await navigator.clipboard.writeText(tsvContent);
      showToast('Table copied! Paste directly into Excel or Google Sheets.');
    }
  };

  return (
    <div className="amz-calc-wrap">
      {/* Top Banner Ad */}
      <AdBanner position="header" />

      {/* Header Card */}
      <header className="amz-header-card">
        <div className="amz-header-left">
          <div className="amz-header-icon" aria-hidden="true">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <line x1="8" y1="6" x2="16" y2="6" />
              <line x1="16" y1="14" x2="16" y2="18" />
              <path d="M16 10h.01" />
              <path d="M12 10h.01" />
              <path d="M8 10h.01" />
              <path d="M12 14h.01" />
              <path d="M8 14h.01" />
              <path d="M12 18h.01" />
              <path d="M8 18h.01" />
            </svg>
          </div>
          <div>
            <div className="amz-header-title-row">
              <h1 className="amz-header-title">Amazon Affiliate Commission Calculator</h1>
              {/* <span className="amz-badge-pro">PRO</span> */}
            </div>
            <p className="amz-header-sub">Global Storefront Yield & Live Home Currency Converter</p>
          </div>
        </div>

        {/* Live Status Badge */}
        <div className="amz-rate-status">
          <span className="amz-pulse-dot-wrap">
            <span className="amz-pulse-ping" />
            <span className={`amz-pulse-dot ${ratePulseColor !== 'normal' ? ratePulseColor : ''}`} />
          </span>
          <span>{rateStatus}</span>
        </div>
      </header>

      {/* BLOCK 1: Storefront & Target Currencies */}
      <section className="amz-card">
        <h2 className="amz-card-title">
          <span className="amz-title-left">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            1. Storefront & Target Currencies
          </span>
        </h2>

        <div className="amz-grid-2">
          {/* Storefront Currency Selector */}
          <div className="amz-field">
            <label htmlFor="amz-storefront-select" className="amz-label">
              Amazon Storefront Market
            </label>
            <select
              id="amz-storefront-select"
              className="amz-select"
              value={storefrontId}
              onChange={handleStorefrontChange}
            >
              {STOREFRONTS.map((sf) => (
                <option key={sf.id} value={sf.id}>
                  {sf.id === 'CUSTOM' ? sf.label : `${sf.label} — ${sf.code} (${sf.symbol})`}
                </option>
              ))}
            </select>
          </div>

          {/* Target Payout Currency Selector */}
          <div className="amz-field">
            <label htmlFor="amz-target-currency-select" className="amz-label">
              Target Home Payout Currency
            </label>
            <select
              id="amz-target-currency-select"
              className="amz-select"
              value={targetCurrencyCode}
              onChange={(e) => {
                setTargetCurrencyCode(e.target.value);
                e.target.blur();
              }}
            >
              {TARGET_CURRENCIES.map((tc) => (
                <option key={tc.code} value={tc.code}>
                  {tc.label}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Storefront Symbol Input (if custom selected) */}
          {storefrontId === 'CUSTOM' && (
            <div className="amz-field">
              <label htmlFor="amz-custom-symbol" className="amz-label">
                Custom Storefront Symbol
              </label>
              <input
                id="amz-custom-symbol"
                type="text"
                className="amz-input"
                placeholder="e.g. Mex$, $, CA$, kr, R$, CHF"
                value={customStorefrontSymbol}
                onChange={(e) => setCustomStorefrontSymbol(e.target.value)}
              />
            </div>
          )}

          {/* Custom Target ISO Input (if custom selected) */}
          {targetCurrencyCode === 'CUSTOM' && (
            <div className="amz-field">
              <label htmlFor="amz-custom-target" className="amz-label">
                Custom Target ISO Currency Code
              </label>
              <input
                id="amz-custom-target"
                type="text"
                maxLength={4}
                className="amz-input"
                placeholder="Enter 3-letter code e.g. NZD, KES, CHF, THB"
                value={customTargetCode}
                onChange={(e) => setCustomTargetCode(e.target.value.toUpperCase())}
              />
            </div>
          )}
        </div>

        {/* Live Exchange Rate Banner (Auto Fetched & Manually Editable) */}
        <div className="amz-exchange-box">
          <div className="amz-exchange-left">
            <div className="amz-exchange-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="17 1 21 5 17 9" />
                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                <polyline points="7 23 3 19 7 15" />
                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
              </svg>
            </div>
            <div>
              <div className="amz-exchange-info-title">Foreign Exchange Conversion Rate</div>
              <div className="amz-exchange-info-sub">
                1 {activeBaseCode} = {exchangeRate || '—'} {activeTargetCode}
              </div>
            </div>
          </div>

          <div className="amz-exchange-right">
            <span className="amz-exchange-static-label">1 {activeBaseCode} =</span>
            <input
              id="amz-exchange-rate-input"
              type="number"
              step="0.0001"
              min="0.0001"
              className="amz-rate-input"
              value={exchangeRate}
              onChange={handleExchangeRateChange}
              title="Click to type a custom conversion rate, or click refresh to fetch live rate"
              aria-label={`Custom exchange rate: 1 ${activeBaseCode} in ${activeTargetCode}`}
            />
            <span className="amz-exchange-static-label">{activeTargetCode}</span>
            <button
              type="button"
              className={`amz-refresh-btn ${isRefreshingRate ? 'spinning' : ''}`}
              onClick={() => fetchExchangeRate(true)}
              title="Refresh and display live central bank rate"
              aria-label="Refresh and display live exchange rate"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* BLOCK 2: Select Commission Category Rate (Dynamically customized by Storefront Market) */}
      <section className="amz-card">
        <h2 className="amz-card-title">
          <span className="amz-title-left">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
            2. Select Commission Category Rate ({storefrontCountryLabel} Tiers)
          </span>
        </h2>

        <div className="amz-grid-3">
          {/* Category Presets Dropdown */}
          <div className="amz-field">
            <label htmlFor="amz-category-select" className="amz-label">
              Official Category Tier for {storefrontCountryLabel === 'US' ? 'United States' : storefrontCountryLabel === 'UK' ? 'United Kingdom' : storefrontCountryLabel}
            </label>
            <select
              id="amz-category-select"
              className="amz-select"
              value={categoryPreset}
              onChange={handleCategoryPresetChange}
            >
              {activeCategoryPresets.map((cat, idx) => (
                <option key={`${cat.value}-${idx}`} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Manual Active Rate % Input */}
          <div className="amz-field">
            <label htmlFor="amz-commission-input" className="amz-label">
              Active Rate (%)
            </label>
            <div className="amz-rate-input-wrap">
              <input
                id="amz-commission-input"
                type="number"
                step="0.1"
                min="0"
                max="100"
                className="amz-input"
                value={commissionRate}
                onChange={handleCommissionRateChange}
              />
              <span className="amz-rate-percent-sign">%</span>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCK 3: Bulk Price Entry */}
      <section className="amz-card">
        <h2 className="amz-card-title">
          <span className="amz-title-left">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            3. Item Prices Bulk Entry
          </span>
          <button type="button" className="amz-sample-btn" onClick={handleLoadSample}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            Load Sample Data
          </button>
        </h2>

        <div>
          <textarea
            id="amz-bulk-prices"
            className="amz-textarea"
            rows={5}
            placeholder={`Paste item prices separated by lines, spaces, or commas...\nExample:\n29.99\n149.50, 89.00\n499.99`}
            value={bulkPrices}
            onChange={(e) => setBulkPrices(e.target.value)}
          />
          <p className="amz-help-text">
            Accepts any currency format (e.g., $49.99, 120.00, 350.50). Multiple lines or comma lists are parsed automatically.
          </p>
        </div>

        {/* Action Triggers */}
        <div className="amz-actions-row">
          <button type="button" className="amz-btn-calc" onClick={() => calculateCommission(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <line x1="8" y1="6" x2="16" y2="6" />
              <line x1="16" y1="14" x2="16" y2="18" />
              <path d="M16 10h.01" />
              <path d="M12 10h.01" />
              <path d="M8 10h.01" />
              <path d="M12 14h.01" />
              <path d="M8 14h.01" />
              <path d="M12 18h.01" />
              <path d="M8 18h.01" />
            </svg>
            Calculate Commission
          </button>
          <button type="button" className="amz-btn-clear" onClick={handleClear}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Clear
          </button>
        </div>
      </section>

      {/* BLOCK 4: Payout Summary Dashboard */}
      <section className="amz-card">
        <h2 className="amz-card-title">
          <span className="amz-title-left">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
              <path d="M22 12A10 10 0 0 0 12 2v10z" />
            </svg>
            Payout Summary
          </span>
          <button type="button" className="amz-copy-btn" onClick={handleCopySummary}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy Summary
          </button>
        </h2>

        <div className="amz-summary-grid">
          {/* Processed Item Count */}
          <div className="amz-stat-card">
            <div className="amz-stat-label">Processed Items</div>
            <div className="amz-stat-value">{calculatedData ? calculatedData.itemCount : 0}</div>
          </div>

          {/* Gross Sales Volume */}
          <div className="amz-stat-card">
            <div className="amz-stat-label">Gross Sales Volume</div>
            <div className="amz-stat-value">
              {calculatedData ? formatMoney(calculatedData.grossSales, calculatedData.symbol) : `${activeSymbol}0.00`}
            </div>
          </div>

          {/* Net Target Payout Highlight Card */}
          <div className="amz-payout-hero-card">
            <div className="amz-payout-header">
              <span className="amz-payout-label">Net Target Payout</span>
              <span className="amz-payout-rate-badge">
                1 {activeBaseCode} = {isNaN(parseFloat(exchangeRate)) ? exchangeRate : parseFloat(exchangeRate).toFixed(2)} {activeTargetCode}
              </span>
            </div>
            <div className="amz-payout-amount">
              {calculatedData ? formatMoney(calculatedData.totalTargetPayout, activeTargetSymbol) : `${formatMoney(0, activeTargetSymbol)}`}
              <span className="amz-payout-amount-code">{activeTargetCode}</span>
            </div>
          </div>
        </div>

        {/* ⚠️ REQUIRED NOTE BELOW THE CALCULATED PRICE */}
        <div className="amz-disclaimer-box">
          <div className="amz-disclaimer-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="amz-disclaimer-text">
            <strong>Estimation Notice:</strong> The displayed payout is an approximation for estimation and planning purposes only.
            Actual net earnings deposited into your bank account may differ due to foreign exchange conversion spreads, payment processor
            fees (e.g., Payoneer, Wise, direct wire fees), applicable withholding tax (such as US IRS Form W-8BEN deductions), local VAT/GST,
            and customer product returns or cancellations.{' '}
            <button
              type="button"
              className="amz-terms-link-btn"
              onClick={() => setShowTermsModal(true)}
            >
              View Terms &amp; Conditions
            </button>
          </p>
        </div>
      </section>

      {/* BLOCK 5: Line Item Matrix Breakdown */}
      <section className="amz-card">
        <h2 className="amz-card-title">
          <span className="amz-title-left">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="3" y1="15" x2="21" y2="15" />
              <line x1="9" y1="3" x2="9" y2="21" />
              <line x1="15" y1="3" x2="15" y2="21" />
            </svg>
            Itemized Breakdown ({calculatedData ? `${calculatedData.lineItems.length} lines` : '0 lines'})
          </span>
          <button type="button" className="amz-copy-btn excel" onClick={handleCopyExcel}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="8" y1="13" x2="16" y2="13" />
              <line x1="8" y1="17" x2="16" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            Copy Excel Table
          </button>
        </h2>

        <div className="amz-mobile-scroll-hint">
          <span>&larr; Swipe to view all columns &rarr;</span>
        </div>

        <div className="amz-table-wrap">
          <table className="amz-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>#</th>
                <th>Price ({activeSymbol})</th>
                <th>Local Converted ({activeTargetSymbol && activeTargetSymbol !== activeTargetCode ? `${activeTargetSymbol} / ${activeTargetCode}` : activeTargetCode})</th>
                <th>Rate</th>
                <th style={{ textAlign: 'right' }}>Payout ({activeTargetSymbol})</th>
              </tr>
            </thead>
            <tbody>
              {calculatedData && calculatedData.lineItems.length > 0 ? (
                calculatedData.lineItems.map((item) => (
                  <tr key={item.id} className="amz-table-row">
                    <td className="amz-td-id">{item.id}</td>
                    <td className="amz-td-price">{formatMoney(item.price, calculatedData.symbol)}</td>
                    <td className="amz-td-converted">
                      {formatMoney(item.localConvertedPrice, calculatedData.targetSymbol)}
                    </td>
                    <td className="amz-td-rate">
                      <span className="amz-rate-pill">{item.yieldRate.toFixed(2)}%</span>
                    </td>
                    <td className="amz-td-payout">
                      {formatMoney(item.targetPayout, calculatedData.targetSymbol)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="amz-empty-state">
                    No calculations yet. Enter item prices and click &ldquo;Calculate Commission&rdquo;.
                  </td>
                </tr>
              )}
            </tbody>
            {calculatedData && calculatedData.lineItems.length > 0 && (
              <tfoot>
                <tr className="amz-tfoot-row">
                  <td className="amz-tf-label">TOTAL</td>
                  <td className="amz-tf-price">{formatMoney(calculatedData.grossSales, calculatedData.symbol)}</td>
                  <td className="amz-tf-converted">
                    {formatMoney(calculatedData.totalLocalConvertedSales, calculatedData.targetSymbol)}
                  </td>
                  <td className="amz-tf-dash">-</td>
                  <td className="amz-tf-payout">
                    {formatMoney(calculatedData.totalTargetPayout, calculatedData.targetSymbol)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </section>

      {/* Floating Toast Notification */}
      <div className={`amz-toast ${toast.show ? 'show' : ''} ${toast.isError ? 'error' : 'success'}`} role="status">
        {toast.isError ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        <span>{toast.message}</span>
      </div>
      {/* Terms & Estimation Disclaimer Modal Popup */}
      {showTermsModal && (
        <div
          className="amz-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="amz-modal-title"
        >
          <div className="amz-modal-backdrop" onClick={handleAcceptTerms} />
          <div className="amz-modal-card">
            <div className="amz-modal-header">
              <div className="amz-modal-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="amz-modal-header-text">
                <h2 id="amz-modal-title" className="amz-modal-title">Terms &amp; Estimation Notice</h2>
                <p className="amz-modal-sub">Please review terms and approximate estimation policies before continuing</p>
              </div>
            </div>

            <div className="amz-modal-body">
              <div className="amz-modal-point">
                <div className="amz-point-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <div>
                  <h3 className="amz-point-title">Approximate Estimation Only</h3>
                  <p className="amz-point-desc">
                    All calculations, converted totals, and commission projections displayed by this tool are <strong>estimates</strong> for financial planning and analysis. They do not constitute guaranteed earnings statements.
                  </p>
                </div>
              </div>

              <div className="amz-modal-point">
                <div className="amz-point-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="17 1 21 5 17 9" />
                    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                    <polyline points="7 23 3 19 7 15" />
                    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                  </svg>
                </div>
                <div>
                  <h3 className="amz-point-title">Currency &amp; Bank Conversion Spreads</h3>
                  <p className="amz-point-desc">
                    Exchange rates are updated live via interbank currency data. Net amounts deposited into your local bank or payout wallet (e.g., Payoneer, Wise, direct wire) may differ due to banking forex spreads and cross-border conversion fees.
                  </p>
                </div>
              </div>

              <div className="amz-modal-point">
                <div className="amz-point-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                </div>
                <div>
                  <h3 className="amz-point-title">Taxes, Withholding &amp; Returns</h3>
                  <p className="amz-point-desc">
                    Final payments are subject to applicable withholding taxes (such as US IRS Form W-8BEN tax deductions up to 30% for non-US associates), local VAT/GST, and deductions for customer returns, canceled orders, or shipping exclusions per official Amazon Associate terms.
                  </p>
                </div>
              </div>

              <div className="amz-modal-point">
                <div className="amz-point-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                  </svg>
                </div>
                <div>
                  <h3 className="amz-point-title">Independent Tool Disclaimer</h3>
                  <p className="amz-point-desc">
                    ToolsOfSaaS.com is an independent utility and is not affiliated with, endorsed by, or officially associated with Amazon.com, Inc. or its subsidiaries.
                  </p>
                </div>
              </div>
            </div>

            <div className="amz-modal-footer">
              <button
                type="button"
                className="amz-modal-btn-accept"
                onClick={handleAcceptTerms}
                autoFocus
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                OK, I Understand &amp; Agree
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

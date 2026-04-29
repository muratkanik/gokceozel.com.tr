'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  APPOINTMENT_STATUSES,
  PENDING_APPOINTMENT_STATUSES,
  appointmentStatusLabel,
  appointmentStatusTone,
} from '@/lib/appointment-status';
import {
  Activity,
  ArrowUpDown,
  BarChart3,
  Building2,
  CalendarDays,
  ChevronDown,
  CreditCard,
  Download,
  FileText,
  Landmark,
  Lock,
  LogOut,
  Mail,
  PieChart,
  Plus,
  Receipt,
  RefreshCw,
  Search,
  Settings,
  Share2,
  Shield,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  StickyNote,
  Trash2,
  UserRound,
  Wallet,
  X,
} from 'lucide-react';

type Role = 'secretary' | 'doctor';
type ServiceType = string;
type PaymentFilter = string | 'all';
type AppointmentSortKey = 'date' | 'name' | 'status' | 'service';

interface CariUser {
  username: string;
  email?: string;
  name: string;
  role: Role;
}

interface CariEntry {
  id: string;
  date: string;
  patient: string;
  phone: string;
  serviceType: ServiceType;
  procedure: string;
  diagnosis: string;
  packageName: string;
  hospital: string;
  hasInsurance: boolean;
  insuranceProviders: string[];
  insurance: number;
  cash: number;
  card: number;
  iban: number;
  payments: Record<string, number>;
  expense: number;
  note: string;
  createdBy: string;
  createdAt: string;
}

interface CariLog {
  id: string;
  at: string;
  user: string;
  action: string;
  detail: string;
}

interface CariServiceType {
  id: string;
  name: string;
  usedCount: number;
  createdBy: string;
  createdAt: string;
}

interface CariPaymentType {
  id: string;
  name: string;
  color: string;
  sortOrder: number;
  usedCount: number;
  createdBy: string;
  createdAt: string;
}

interface CariReservation {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  status: string;
  date: string;
  startTime: string;
  endTime: string;
  source: string;
  createdAt: string;
}

interface AvailabilitySlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

interface CalendarAvailabilityDay {
  date: string;
  availableCount: number;
  available: boolean;
  reason?: string;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

type BadgeNavigator = Navigator & {
  setAppBadge?: (contents?: number) => Promise<void>;
  clearAppBadge?: () => Promise<void>;
};

const fallbackServiceTypes: CariServiceType[] = ['Muayenehane', 'Ameliyat', 'Ozon', 'Botox/Dolgu'].map((name) => ({
  id: name,
  name,
  usedCount: 0,
  createdBy: 'Sistem',
  createdAt: '',
}));

const fallbackPaymentTypes: CariPaymentType[] = [
  ['Sigortadan ödenen', '#059669', 10],
  ['Nakit', '#0f172a', 20],
  ['Kart', '#2563eb', 30],
  ['IBAN / havale', '#7c3aed', 40],
].map(([name, color, sortOrder]) => ({
  id: String(name),
  name: String(name),
  color: String(color),
  sortOrder: Number(sortOrder),
  usedCount: 0,
  createdBy: 'Sistem',
  createdAt: '',
}));

const insuranceCompanies = [
  'SGK',
  'Allianz Sigorta',
  'Anadolu Sigorta',
  'Aksigorta',
  'Acıbadem Sigorta',
  'Bupa Acıbadem Sigorta',
  'Mapfre Sigorta',
  'Türkiye Sigorta',
  'Axa Sigorta',
  'Sompo Sigorta',
  'HDI Sigorta',
  'Groupama Sigorta',
  'Zurich Sigorta',
  'Ray Sigorta',
  'Doğa Sigorta',
  'Demir Sağlık ve Hayat',
  'Ethica Sigorta',
  'Quick Sigorta',
  'Unico Sigorta',
  'Gulf Sigorta',
  'Bereket Sigorta',
  'Corpus Sigorta',
  'Magdeburger Sigorta',
  'Katılım Sağlık',
  'Tamamlayıcı Sağlık Sigortası',
  'Özel Sağlık Sigortası',
  'Yurt dışı sigorta',
];

const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
});

const today = new Date().toISOString().slice(0, 10);
const currentMonth = today.slice(0, 7);

function toNumber(value: FormDataEntryValue | null) {
  const normalized = String(value || '').replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function totalIncome(entry: CariEntry) {
  const paymentTotal = Object.values(entry.payments || {}).reduce((sum, value) => sum + value, 0);
  return paymentTotal || entry.insurance + entry.cash + entry.card + entry.iban;
}

function paymentAmount(entry: CariEntry, name: string) {
  if (entry.payments && Object.prototype.hasOwnProperty.call(entry.payments, name)) {
    return entry.payments[name] || 0;
  }

  if (name === 'Sigortadan ödenen') return entry.insurance;
  if (name === 'Nakit') return entry.cash;
  if (name === 'Kart') return entry.card;
  if (name === 'IBAN / havale') return entry.iban;
  return 0;
}

function paidByInsurance(entry: CariEntry) {
  return paymentAmount(entry, 'Sigortadan ödenen');
}

function paymentDetails(entry: CariEntry) {
  const dynamicPayments = Object.entries(entry.payments || {})
    .filter(([, value]) => value > 0)
    .sort(([a], [b]) => a.localeCompare(b, 'tr-TR'));

  if (dynamicPayments.length) return dynamicPayments;

  return [
    ['Sigortadan ödenen', entry.insurance],
    ['Nakit', entry.cash],
    ['Kart', entry.card],
    ['IBAN / havale', entry.iban],
  ].filter(([, value]) => Number(value) > 0) as Array<[string, number]>;
}

function formatCurrency(value: number) {
  return currencyFormatter.format(value || 0);
}

function inDateRange(entry: CariEntry, startDate: string, endDate: string) {
  return (!startDate || entry.date >= startDate) && (!endDate || entry.date <= endDate);
}

function formatLongDate(date: string) {
  if (!date) return 'Tarih seçilmedi';
  return new Intl.DateTimeFormat('tr-TR', { dateStyle: 'full' }).format(new Date(`${date}T12:00:00`));
}

function formatMonthLabel(month: string) {
  return new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric' }).format(new Date(`${month}-01T12:00:00`));
}

function shiftMonthValue(month: string, delta: number) {
  const [year, monthIndex] = month.split('-').map(Number);
  const next = new Date(Date.UTC(year, monthIndex - 1 + delta, 1));
  return `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, '0')}`;
}

export default function CariTakipApp() {
  const [user, setUser] = useState<CariUser | null>(null);
  const [entries, setEntries] = useState<CariEntry[]>([]);
  const [logs, setLogs] = useState<CariLog[]>([]);
  const [serviceTypes, setServiceTypes] = useState<CariServiceType[]>(fallbackServiceTypes);
  const [paymentTypes, setPaymentTypes] = useState<CariPaymentType[]>(fallbackPaymentTypes);
  const [reservations, setReservations] = useState<CariReservation[]>([]);
  const [loginError, setLoginError] = useState('');
  const [appError, setAppError] = useState('');
  const [serviceTypeError, setServiceTypeError] = useState('');
  const [paymentTypeError, setPaymentTypeError] = useState('');
  const [accountError, setAccountError] = useState('');
  const [accountSuccess, setAccountSuccess] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [initializing, setInitializing] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serviceTypeSaving, setServiceTypeSaving] = useState(false);
  const [paymentTypeSaving, setPaymentTypeSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState<'Tümü' | ServiceType>('Tümü');
  const [hasInsurance, setHasInsurance] = useState(false);
  const [selectedInsuranceProviders, setSelectedInsuranceProviders] = useState<string[]>([]);
  const [startDate, setStartDate] = useState(today.slice(0, 8) + '01');
  const [endDate, setEndDate] = useState(today);
  const [activeTab, setActiveTab] = useState<'entry' | 'dashboard' | 'reservations' | 'system'>('entry');
  const [entryModalOpen, setEntryModalOpen] = useState(false);
  const [serviceTypesModalOpen, setServiceTypesModalOpen] = useState(false);
  const [paymentTypesModalOpen, setPaymentTypesModalOpen] = useState(false);
  const [noteEntry, setNoteEntry] = useState<CariEntry | null>(null);
  const [newServiceType, setNewServiceType] = useState('');
  const [newPaymentType, setNewPaymentType] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>('all');
  const [appointmentView, setAppointmentView] = useState<'calendar' | 'list' | 'table' | 'settings'>('calendar');
  const [appointmentQuery, setAppointmentQuery] = useState('');
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState('all');
  const [appointmentSortKey, setAppointmentSortKey] = useState<AppointmentSortKey>('date');
  const [appointmentSortDirection, setAppointmentSortDirection] = useState<'asc' | 'desc'>('desc');
  const [appointmentCalendarMonth, setAppointmentCalendarMonth] = useState(currentMonth);
  const [selectedAppointmentDate, setSelectedAppointmentDate] = useState(today);
  const [calendarDays, setCalendarDays] = useState<CalendarAvailabilityDay[]>([]);
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [availabilityReason, setAvailabilityReason] = useState('');
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [reservationSettings, setReservationSettings] = useState<any>(null);
  const [reservationBlackouts, setReservationBlackouts] = useState<any[]>([]);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [reminderSendingId, setReminderSendingId] = useState('');
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [installHidden, setInstallHidden] = useState(false);
  const previousPendingAppointmentCount = useRef(0);
  const pullStartY = useRef<number | null>(null);

  const fetchCariData = useCallback(async () => {
    const [entriesResponse, logsResponse, serviceTypesResponse, paymentTypesResponse, reservationsResponse] = await Promise.all([
      fetch('/api/cari/entries', { credentials: 'include' }),
      fetch('/api/cari/logs', { credentials: 'include' }),
      fetch('/api/cari/service-types', { credentials: 'include' }),
      fetch('/api/cari/payment-types', { credentials: 'include' }),
      fetch('/api/cari/reservations', { credentials: 'include' }),
    ]);

    if (!entriesResponse.ok || !logsResponse.ok || !serviceTypesResponse.ok || !paymentTypesResponse.ok || !reservationsResponse.ok) {
      throw new Error('Cari verileri alınamadı.');
    }

    const [nextEntries, nextLogs, nextServiceTypes, nextPaymentTypes, nextReservations] = await Promise.all([
      entriesResponse.json(),
      logsResponse.json(),
      serviceTypesResponse.json(),
      paymentTypesResponse.json(),
      reservationsResponse.json(),
    ]);

    setEntries(nextEntries);
    setLogs(nextLogs);
    setServiceTypes(nextServiceTypes.length ? nextServiceTypes : fallbackServiceTypes);
    setPaymentTypes(nextPaymentTypes.length ? nextPaymentTypes : fallbackPaymentTypes);
    setReservations(nextReservations);
  }, []);

  const refreshCariData = useCallback(async () => {
    if (!user || refreshing) return;
    setRefreshing(true);
    setAppError('');
    try {
      await fetchCariData();
    } catch (error) {
      setAppError('Cari verileri yenilenemedi.');
    } finally {
      setRefreshing(false);
    }
  }, [fetchCariData, refreshing, user]);

  const pendingAppointments = useMemo(
    () => reservations.filter((reservation) => PENDING_APPOINTMENT_STATUSES.has(reservation.status)),
    [reservations]
  );

  const pendingAppointmentCount = pendingAppointments.length;

  const filteredReservations = useMemo(() => {
    const normalizedQuery = appointmentQuery.trim().toLocaleLowerCase('tr-TR');
    const statusFiltered = appointmentStatusFilter === 'all'
      ? reservations
      : reservations.filter((reservation) => (reservation.status || 'pending') === appointmentStatusFilter);

    return statusFiltered
      .filter((reservation) => {
        if (!normalizedQuery) return true;
        return [
          reservation.name,
          reservation.phone,
          reservation.email,
          reservation.service,
          reservation.message,
          appointmentStatusLabel(reservation.status),
          reservation.date,
          reservation.startTime,
        ]
          .join(' ')
          .toLocaleLowerCase('tr-TR')
          .includes(normalizedQuery);
      })
      .sort((a, b) => {
        const direction = appointmentSortDirection === 'asc' ? 1 : -1;
        if (appointmentSortKey === 'date') {
          const left = `${a.date || ''} ${a.startTime || ''}`;
          const right = `${b.date || ''} ${b.startTime || ''}`;
          return left.localeCompare(right) * direction;
        }
        if (appointmentSortKey === 'name') return a.name.localeCompare(b.name, 'tr-TR') * direction;
        if (appointmentSortKey === 'status') return appointmentStatusLabel(a.status).localeCompare(appointmentStatusLabel(b.status), 'tr-TR') * direction;
        return (a.service || '').localeCompare(b.service || '', 'tr-TR') * direction;
      });
  }, [appointmentQuery, appointmentSortDirection, appointmentSortKey, appointmentStatusFilter, reservations]);

  const patientDirectory = useMemo(() => {
    const patients = new Map<string, { name: string; phone: string; email: string; count: number; lastDate: string; statuses: Set<string> }>();

    reservations.forEach((reservation) => {
      const key = `${reservation.name.trim().toLocaleLowerCase('tr-TR')}|${reservation.phone || reservation.email}`;
      const current = patients.get(key) || {
        name: reservation.name,
        phone: reservation.phone,
        email: reservation.email,
        count: 0,
        lastDate: '',
        statuses: new Set<string>(),
      };
      current.count += 1;
      current.lastDate = [current.lastDate, reservation.date].filter(Boolean).sort().at(-1) || '';
      current.statuses.add(reservation.status || 'pending');
      patients.set(key, current);
    });

    return Array.from(patients.values()).sort((a, b) => a.name.localeCompare(b.name, 'tr-TR'));
  }, [reservations]);

  const reservationsByDate = useMemo(() => {
    const map = new Map<string, CariReservation[]>();
    filteredReservations.forEach((reservation) => {
      if (!reservation.date) return;
      map.set(reservation.date, [...(map.get(reservation.date) || []), reservation]);
    });
    return map;
  }, [filteredReservations]);

  const selectedDateReservations = useMemo(
    () => reservationsByDate.get(selectedAppointmentDate) || [],
    [reservationsByDate, selectedAppointmentDate]
  );

  const appointmentCalendarCells = useMemo(() => {
    const [year, month] = appointmentCalendarMonth.split('-').map(Number);
    const firstDay = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
    const leading = (firstDay + 6) % 7;
    return [
      ...Array.from({ length: leading }, () => null),
      ...calendarDays,
    ];
  }, [appointmentCalendarMonth, calendarDays]);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('resetToken') || '';
    if (token) {
      setResetToken(token);
    }

    let mounted = true;

    async function boot() {
      try {
        const response = await fetch('/api/cari/auth/session', { credentials: 'include' });
        const payload = await response.json();

        if (!mounted) return;

        if (payload.user) {
          setUser(payload.user);
          setActiveTab('dashboard');
          await fetchCariData();
        }
      } catch (error) {
        if (mounted) setAppError('Cari oturumu kontrol edilirken hata oluştu.');
      } finally {
        if (mounted) setInitializing(false);
      }
    }

    boot();

    return () => {
      mounted = false;
    };
  }, [fetchCariData]);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/cari-sw.js').catch(() => undefined);
    }

    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    if (isStandalone || window.localStorage.getItem('cari-install-hidden') === 'true') {
      setInstallHidden(true);
      return;
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
      setShowInstallHelp(true);
    };

    const handleInstalled = () => {
      window.localStorage.setItem('cari-install-hidden', 'true');
      setInstallHidden(true);
      setShowInstallHelp(false);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);

    const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    if (isIos) {
      setShowInstallHelp(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    const handleTouchStart = (event: TouchEvent) => {
      if (window.scrollY <= 0) {
        pullStartY.current = event.touches[0]?.clientY ?? null;
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const startY = pullStartY.current;
      pullStartY.current = null;
      if (startY === null || window.scrollY > 0) return;

      const endY = event.changedTouches[0]?.clientY ?? startY;
      if (endY - startY > 90) {
        void refreshCariData();
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [refreshCariData, user]);

  useEffect(() => {
    if (!user) return;

    const timer = window.setInterval(() => {
      fetchCariData().catch(() => undefined);
    }, 60000);

    return () => window.clearInterval(timer);
  }, [fetchCariData, user]);

  useEffect(() => {
    if (!user || activeTab !== 'reservations' || appointmentView !== 'calendar') return;

    let mounted = true;
    fetch(`/api/rezervasyon/takvim?month=${encodeURIComponent(appointmentCalendarMonth)}`)
      .then((response) => response.json())
      .then((data) => {
        if (mounted) setCalendarDays(data.days || []);
      })
      .catch(() => {
        if (mounted) setCalendarDays([]);
      });

    return () => {
      mounted = false;
    };
  }, [activeTab, appointmentCalendarMonth, appointmentView, user]);

  useEffect(() => {
    if (!user || activeTab !== 'reservations' || appointmentView !== 'calendar' || !selectedAppointmentDate) return;

    let mounted = true;
    setAvailabilityLoading(true);
    fetch(`/api/rezervasyon/musaitlik?date=${encodeURIComponent(selectedAppointmentDate)}`)
      .then((response) => response.json())
      .then((data) => {
        if (!mounted) return;
        setAvailabilitySlots(data.slots || []);
        setAvailabilityReason(data.reason || '');
      })
      .catch(() => {
        if (!mounted) return;
        setAvailabilitySlots([]);
        setAvailabilityReason('Müsait saatler alınamadı.');
      })
      .finally(() => {
        if (mounted) setAvailabilityLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [activeTab, appointmentView, selectedAppointmentDate, user]);

  useEffect(() => {
    if (!user || activeTab !== 'reservations' || appointmentView !== 'settings') return;

    let mounted = true;
    setSettingsLoading(true);
    Promise.all([
      fetch('/api/cari/reservation-settings', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/cari/reservation-blackouts', { credentials: 'include' }).then(r => r.json()),
    ]).then(([settingsData, blackoutsData]) => {
      if (!mounted) return;
      if (settingsData && !settingsData.error) setReservationSettings(settingsData);
      if (Array.isArray(blackoutsData)) setReservationBlackouts(blackoutsData);
    }).catch(console.error).finally(() => {
      if (mounted) setSettingsLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [activeTab, appointmentView, user]);

  useEffect(() => {
    if (!user) return;

    const badgeNavigator = navigator as BadgeNavigator;
    if (pendingAppointmentCount > 0) {
      void badgeNavigator.setAppBadge?.(pendingAppointmentCount).catch(() => undefined);
    } else {
      void badgeNavigator.clearAppBadge?.().catch(() => undefined);
    }

    if (
      previousPendingAppointmentCount.current > 0 &&
      pendingAppointmentCount > previousPendingAppointmentCount.current &&
      'Notification' in window &&
      Notification.permission === 'granted'
    ) {
      const latest = pendingAppointments[0];
      new Notification('Yeni randevu talebi', {
        body: latest ? `${latest.name} · ${latest.date || 'Tarih seçilmedi'} ${latest.startTime || ''}` : 'Yeni bir randevu talebi var.',
        icon: '/cari-icon.svg',
        badge: '/cari-icon.svg',
      });
    }

    previousPendingAppointmentCount.current = pendingAppointmentCount;
  }, [pendingAppointmentCount, pendingAppointments, user]);

  const handleInstallClick = async () => {
    if (!installPrompt) {
      setShowInstallHelp(true);
      return;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;

    if (choice.outcome === 'accepted') {
      window.localStorage.setItem('cari-install-hidden', 'true');
      setInstallHidden(true);
      setShowInstallHelp(false);
    }

    setInstallPrompt(null);
  };

  const dismissInstallPrompt = () => {
    window.localStorage.setItem('cari-install-hidden', 'true');
    setInstallHidden(true);
    setShowInstallHelp(false);
  };

  const filteredEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('tr-TR');

    return entries
      .filter((entry) => inDateRange(entry, startDate, endDate))
      .filter((entry) => serviceFilter === 'Tümü' || entry.serviceType === serviceFilter)
      .filter((entry) => {
        if (!normalizedQuery) return true;
        return [entry.patient, entry.phone, entry.procedure, entry.diagnosis, entry.packageName, entry.note, ...entry.insuranceProviders]
          .join(' ')
          .toLocaleLowerCase('tr-TR')
          .includes(normalizedQuery);
      })
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  }, [entries, query, serviceFilter, startDate, endDate]);

  const serviceTypeNames = useMemo(() => {
    const names = new Set(serviceTypes.map((type) => type.name));
    entries.forEach((entry) => {
      if (entry.serviceType) names.add(entry.serviceType);
    });
    return Array.from(names).sort((a, b) => a.localeCompare(b, 'tr-TR'));
  }, [entries, serviceTypes]);

  const summary = useMemo(() => {
    const initial = {
      insurance: 0,
      cash: 0,
      card: 0,
      iban: 0,
      expense: 0,
      insuredCount: 0,
      count: filteredEntries.length,
      payments: {} as Record<string, number>,
    };

    return filteredEntries.reduce((acc, entry) => {
      acc.insurance += paidByInsurance(entry);
      acc.cash += paymentAmount(entry, 'Nakit');
      acc.card += paymentAmount(entry, 'Kart');
      acc.iban += paymentAmount(entry, 'IBAN / havale');
      acc.expense += entry.expense;
      paymentDetails(entry).forEach(([name, value]) => {
        acc.payments[name] = (acc.payments[name] || 0) + Number(value || 0);
      });
      if (entry.hasInsurance) acc.insuredCount += 1;
      return acc;
    }, initial);
  }, [filteredEntries]);

  const byService = useMemo(() => {
    return serviceTypeNames.map((serviceType) => {
      const serviceEntries = filteredEntries.filter((entry) => entry.serviceType === serviceType);
      return {
        serviceType,
        count: serviceEntries.length,
        income: serviceEntries.reduce((total, entry) => total + totalIncome(entry), 0),
      };
    });
  }, [filteredEntries, serviceTypeNames]);

  const dailyTotals = useMemo(() => {
    const totals = new Map<string, number>();
    filteredEntries.forEach((entry) => {
      totals.set(entry.date, (totals.get(entry.date) || 0) + totalIncome(entry) - entry.expense);
    });
    return Array.from(totals.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-10);
  }, [filteredEntries]);

  const byInsuranceProvider = useMemo(() => {
    const totals = new Map<string, { count: number; insurance: number; total: number }>();

    filteredEntries.forEach((entry) => {
      const providers = entry.insuranceProviders.length ? entry.insuranceProviders : entry.hasInsurance ? ['Sağlayıcı seçilmedi'] : [];
      providers.forEach((provider) => {
        const current = totals.get(provider) || { count: 0, insurance: 0, total: 0 };
        current.count += 1;
        current.insurance += paidByInsurance(entry);
        current.total += totalIncome(entry);
        totals.set(provider, current);
      });
    });

    return Array.from(totals.entries())
      .map(([provider, values]) => ({ provider, ...values }))
      .sort((a, b) => b.insurance - a.insurance)
      .slice(0, 8);
  }, [filteredEntries]);

  const paymentBreakdown = useMemo(() => {
    const knownNames = new Set(paymentTypes.map((type) => type.name));
    Object.keys(summary.payments).forEach((name) => knownNames.add(name));
    const colorByName = new Map(paymentTypes.map((type) => [type.name, type.color]));
    const orderByName = new Map(paymentTypes.map((type) => [type.name, type.sortOrder]));
    const items = Array.from(knownNames)
      .map((name) => ({
        key: name,
        label: name,
        value: summary.payments[name] || 0,
        color: colorByName.get(name) || '#0f172a',
        sortOrder: orderByName.get(name) || 999,
      }))
      .sort((a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label, 'tr-TR'));

    const total = items.reduce((sum, item) => sum + item.value, 0);
    let cursor = 0;

    return items.map((item) => {
      const percentage = total ? (item.value / total) * 100 : 0;
      const start = cursor;
      cursor += percentage;
      return { ...item, percentage, start, end: cursor };
    });
  }, [paymentTypes, summary.payments]);

  const paymentTotal = paymentBreakdown.reduce((sum, item) => sum + item.value, 0);
  const paymentChartBackground = paymentTotal
    ? `conic-gradient(${paymentBreakdown
        .map((item) => `${item.color} ${item.start}% ${item.end}%`)
        .join(', ')})`
    : 'conic-gradient(#e2e8f0 0% 100%)';
  const paymentFilteredEntries = useMemo(() => {
    if (paymentFilter === 'all') return filteredEntries;
    return filteredEntries.filter((entry) => Number(entry.payments?.[paymentFilter] || 0) > 0);
  }, [filteredEntries, paymentFilter]);
  const activePaymentLabel = paymentFilter === 'all'
    ? 'Tüm tahsilatlar'
    : paymentBreakdown.find((item) => item.key === paymentFilter)?.label || 'Tüm tahsilatlar';

  const grossIncome = paymentTotal;
  const netIncome = grossIncome - summary.expense;
  const maxDailyTotal = Math.max(...dailyTotals.map(([, value]) => value), 1);
  const maxServiceTotal = Math.max(...byService.map((item) => item.income), 1);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = String(formData.get('username') || '').trim();
    const password = String(formData.get('password') || '');

    setSaving(true);
    setLoginError('');
    setAppError('');

    try {
      const response = await fetch('/api/cari/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        setLoginError('Kullanıcı adı veya şifre hatalı.');
        return;
      }

      const payload = await response.json();
      setUser(payload.user);
      setActiveTab('dashboard');
      await fetchCariData();
    } catch (error) {
      setLoginError('Giriş yapılırken bağlantı hatası oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/cari/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
    setEntries([]);
    setLogs([]);
    setReservations([]);
  };

  const updateReservationStatus = async (id: string, status: string) => {
    setSaving(true);
    setAppError('');
    try {
      const response = await fetch(`/api/cari/reservations/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Randevu güncellenemedi.');
      await fetchCariData();
    } catch (error) {
      setAppError('Randevu güncellenemedi.');
    } finally {
      setSaving(false);
    }
  };

  const sendReservationReminder = async (id: string) => {
    setReminderSendingId(id);
    setAppError('');
    try {
      const response = await fetch(`/api/cari/reservations/${id}/reminder`, {
        method: 'POST',
        credentials: 'include',
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Hatırlatma maili gönderilemedi.');
      await fetchCariData();
    } catch (error) {
      setAppError(error instanceof Error ? error.message : 'Hatırlatma maili gönderilemedi.');
    } finally {
      setReminderSendingId('');
    }
  };

  const updateAppointmentSort = (key: AppointmentSortKey) => {
    if (appointmentSortKey === key) {
      setAppointmentSortDirection((direction) => direction === 'asc' ? 'desc' : 'asc');
      return;
    }
    setAppointmentSortKey(key);
    setAppointmentSortDirection(key === 'date' ? 'desc' : 'asc');
  };

  const handleForgotPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const identifier = String(formData.get('identifier') || '').trim();
    if (!identifier) return;

    setSaving(true);
    setLoginError('');
    setResetMessage('');

    try {
      await fetch('/api/cari/auth/forgot-password', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });
      setResetMessage('E-posta kayıtlıysa şifre sıfırlama bağlantısı gönderildi.');
    } catch (error) {
      setResetMessage('İstek alındı. Birkaç dakika içinde gelen kutusunu kontrol edin.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = String(formData.get('password') || '');
    const passwordAgain = String(formData.get('passwordAgain') || '');

    setSaving(true);
    setLoginError('');

    if (password.length < 8 || password !== passwordAgain) {
      setLoginError('Yeni şifre en az 8 karakter olmalı ve tekrar alanıyla eşleşmeli.');
      setSaving(false);
      return;
    }

    try {
      const response = await fetch('/api/cari/auth/reset-password', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, password }),
      });

      if (!response.ok) throw new Error('Reset failed');

      const payload = await response.json();
      setUser(payload.user);
      setResetToken('');
      window.history.replaceState({}, '', window.location.pathname);
      setActiveTab('dashboard');
      await fetchCariData();
    } catch (error) {
      setLoginError('Şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş.');
    } finally {
      setSaving(false);
    }
  };

  const saveReservationSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (saving || !user) return;
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    const days = [1, 2, 3, 4, 5, 6, 0].filter(d => formData.get(`day_${d}`) === 'on').map(Number);
    const data = {
      isEnabled: formData.get('isEnabled') === 'on',
      workingDays: days.length ? days : [1, 2, 3, 4, 5, 6],
      dayStart: formData.get('dayStart') as string || '10:00',
      dayEnd: formData.get('dayEnd') as string || '18:00',
      slotMinutes: Number(formData.get('slotMinutes')) || 30,
      bufferMinutes: Number(formData.get('bufferMinutes')) || 0,
      maxPerSlot: Number(formData.get('maxPerSlot')) || 1,
      minNoticeHours: Number(formData.get('minNoticeHours')) || 2,
      bookingHorizonDays: Number(formData.get('bookingHorizonDays')) || 60,
    };
    try {
      const res = await fetch('/api/cari/reservation-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Hata');
      const updated = await res.json();
      setReservationSettings(updated);
      alert('Ayarlar kaydedildi.');
    } catch {
      alert('Kaydedilirken hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const addBlackout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (saving || !user) return;
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    const isFullDay = formData.get('isFullDay') === 'on';
    const data = {
      date: formData.get('date'),
      reason: formData.get('reason'),
      isFullDay,
      startTime: isFullDay ? null : formData.get('startTime'),
      endTime: isFullDay ? null : formData.get('endTime'),
    };
    try {
      const res = await fetch('/api/cari/reservation-blackouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Hata');
      const blackout = await res.json();
      setReservationBlackouts(prev => [...prev, blackout].sort((a, b) => a.date.localeCompare(b.date)));
      (e.target as HTMLFormElement).reset();
    } catch {
      alert('Eklenirken hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const deleteBlackout = async (id: string) => {
    if (saving || !user || !confirm('Silmek istediğinize emin misiniz?')) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/cari/reservation-blackouts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Hata');
      setReservationBlackouts(prev => prev.filter(b => b.id !== id));
    } catch {
      alert('Silinirken hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleAccountUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const username = String(formData.get('username') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const currentPassword = String(formData.get('currentPassword') || '');
    const newPassword = String(formData.get('newPassword') || '');

    setSaving(true);
    setAccountError('');
    setAccountSuccess('');

    try {
      const response = await fetch('/api/cari/account/profile', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, currentPassword, newPassword }),
      });

      if (response.status === 409) {
        setAccountError('Bu kullanıcı adı veya e-posta zaten kullanılıyor.');
        return;
      }

      if (!response.ok) throw new Error('Profile update failed');

      const payload = await response.json();
      setUser(payload.user);
      setAccountSuccess('Hesap bilgileri güncellendi.');
      form.reset();
      await fetchCariData();
    } catch (error) {
      setAccountError('Hesap güncellenemedi. Mevcut şifreyi ve alanları kontrol edin.');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    const form = event.currentTarget;
    const formData = new FormData(event.currentTarget);
    const patient = String(formData.get('patient') || '').trim();
    const procedure = String(formData.get('procedure') || '').trim();
    const serviceType = String(formData.get('serviceType')) as ServiceType;
    const payments = Object.fromEntries(
      paymentTypes
        .map((type) => [type.name, toNumber(formData.get(`payment-${type.id}`))] as const)
        .filter(([, value]) => value > 0)
    );
    const insuranceAmount = payments['Sigortadan ödenen'] || 0;

    if (!patient || !procedure) return;

    const payload = {
      date: String(formData.get('date') || today),
      patient,
      phone: String(formData.get('phone') || '').trim(),
      serviceType,
      procedure,
      diagnosis: String(formData.get('diagnosis') || '').trim(),
      packageName: String(formData.get('packageName') || '').trim(),
      hospital: String(formData.get('hospital') || '').trim(),
      hasInsurance: hasInsurance || selectedInsuranceProviders.length > 0 || insuranceAmount > 0,
      insuranceProviders: selectedInsuranceProviders,
      payments,
      insurance: insuranceAmount,
      cash: payments.Nakit || 0,
      card: payments.Kart || 0,
      iban: payments['IBAN / havale'] || 0,
      expense: toNumber(formData.get('expense')),
      note: String(formData.get('note') || '').trim(),
    };

    setSaving(true);
    setAppError('');

    try {
      const response = await fetch('/api/cari/entries', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Kayıt eklenemedi.');
      }

      const entry = await response.json();
      setEntries((current) => [entry, ...current]);
      await fetchCariData();
      form.reset();
      setHasInsurance(false);
      setSelectedInsuranceProviders([]);
      setEntryModalOpen(false);
      const dateInput = form.elements.namedItem('date') as HTMLInputElement | null;
      if (dateInput) dateInput.value = today;
    } catch (error) {
      setAppError('Cari kayıt eklenemedi. Supabase bağlantısını ve migration durumunu kontrol edin.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const entry = entries.find((item) => item.id === id);
    if (!entry) return;

    setSaving(true);
    setAppError('');

    try {
      const response = await fetch(`/api/cari/entries/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Kayıt silinemedi.');
      }

      setEntries((current) => current.filter((item) => item.id !== id));
      await fetchCariData();
    } catch (error) {
      setAppError('Kayıt silinemedi. Bu işlem yalnızca doktor rolüyle yapılabilir.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateServiceType = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = newServiceType.trim();
    if (!name) return;

    setServiceTypeSaving(true);
    setServiceTypeError('');

    try {
      const response = await fetch('/api/cari/service-types', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (response.status === 409) {
        setServiceTypeError('Bu işlem grubu zaten var.');
        return;
      }

      if (!response.ok) {
        throw new Error('İşlem grubu eklenemedi.');
      }

      setNewServiceType('');
      await fetchCariData();
    } catch (error) {
      setServiceTypeError('İşlem grubu eklenemedi.');
    } finally {
      setServiceTypeSaving(false);
    }
  };

  const handleDeleteServiceType = async (serviceType: CariServiceType) => {
    if (serviceType.usedCount > 0) return;

    setServiceTypeSaving(true);
    setServiceTypeError('');

    try {
      const response = await fetch(`/api/cari/service-types/${serviceType.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.status === 409) {
        setServiceTypeError('Bu işlem grubu kullanıldığı için silinemez.');
        await fetchCariData();
        return;
      }

      if (!response.ok) {
        throw new Error('İşlem grubu silinemedi.');
      }

      if (serviceFilter === serviceType.name) setServiceFilter('Tümü');
      await fetchCariData();
    } catch (error) {
      setServiceTypeError('İşlem grubu silinemedi.');
    } finally {
      setServiceTypeSaving(false);
    }
  };

  const handleCreatePaymentType = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = newPaymentType.trim();
    if (!name) return;

    setPaymentTypeSaving(true);
    setPaymentTypeError('');

    try {
      const response = await fetch('/api/cari/payment-types', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (response.status === 409) {
        setPaymentTypeError('Bu tahsilat türü zaten var.');
        return;
      }

      if (!response.ok) {
        throw new Error('Tahsilat türü eklenemedi.');
      }

      setNewPaymentType('');
      await fetchCariData();
    } catch (error) {
      setPaymentTypeError('Tahsilat türü eklenemedi.');
    } finally {
      setPaymentTypeSaving(false);
    }
  };

  const handleDeletePaymentType = async (paymentType: CariPaymentType) => {
    if (paymentType.usedCount > 0) return;

    setPaymentTypeSaving(true);
    setPaymentTypeError('');

    try {
      const response = await fetch(`/api/cari/payment-types/${paymentType.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.status === 409) {
        setPaymentTypeError('Bu tahsilat türü kullanıldığı için silinemez.');
        await fetchCariData();
        return;
      }

      if (!response.ok) {
        throw new Error('Tahsilat türü silinemedi.');
      }

      if (paymentFilter === paymentType.name) setPaymentFilter('all');
      await fetchCariData();
    } catch (error) {
      setPaymentTypeError('Tahsilat türü silinemedi.');
    } finally {
      setPaymentTypeSaving(false);
    }
  };

  const exportCsv = () => {
    const paymentNames = Array.from(new Set([
      ...paymentTypes.map((type) => type.name),
      ...filteredEntries.flatMap((entry) => Object.keys(entry.payments || {})),
    ])).sort((a, b) => {
      const aOrder = paymentTypes.find((type) => type.name === a)?.sortOrder || 999;
      const bOrder = paymentTypes.find((type) => type.name === b)?.sortOrder || 999;
      return aOrder - bOrder || a.localeCompare(b, 'tr-TR');
    });
    const headers = ['Tarih', 'Hasta', 'Telefon', 'Birim', 'İşlem', 'Tanı', 'Paket', 'Sigortası Var', 'Sigorta Şirketleri', ...paymentNames, 'Gider', 'Net', 'Not'];
    const rows = filteredEntries.map((entry) => [
      entry.date,
      entry.patient,
      entry.phone,
      entry.serviceType,
      entry.procedure,
      entry.diagnosis,
      entry.packageName,
      entry.hasInsurance ? 'Evet' : 'Hayır',
      entry.insuranceProviders.join(', '),
      ...paymentNames.map((name) => paymentAmount(entry, name)),
      entry.expense,
      totalIncome(entry) - entry.expense,
      entry.note,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(';'))
      .join('\n');
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cari-rapor-${startDate || 'baslangic'}-${endDate || 'bitis'}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (initializing) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        <div className="rounded-lg border border-slate-200 bg-white px-5 py-4 text-sm shadow-sm">
          Cari oturumu hazırlanıyor...
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-4 py-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <Image
              src="/images/logo.png"
              alt="Prof. Dr. Gökçe Özel"
              width={220}
              height={90}
              priority
              className="h-auto w-44 object-contain"
            />
          </div>

          <section className="w-full">
            {resetToken ? (
              <form onSubmit={handleResetPassword} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900 text-white">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950">Yeni şifre belirle</h2>
                    <p className="text-sm text-slate-500">Şifren en az 8 karakter olmalı</p>
                  </div>
                </div>
                <label className="mb-4 block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">Yeni şifre</span>
                  <input name="password" type="password" className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" placeholder="Yeni şifre" />
                </label>
                <label className="mb-2 block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">Yeni şifre tekrar</span>
                  <input name="passwordAgain" type="password" className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" placeholder="Yeni şifre tekrar" />
                </label>
                {loginError && <p className="mb-3 text-sm font-medium text-red-600">{loginError}</p>}
                <button disabled={saving} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300">
                  <ShieldCheck className="h-4 w-4" />
                  {saving ? 'Kaydediliyor...' : 'Şifreyi güncelle'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setResetToken('');
                    setLoginError('');
                    window.history.replaceState({}, '', window.location.pathname);
                  }}
                  className="mt-3 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Giriş ekranına dön
                </button>
              </form>
            ) : (
            <form onSubmit={handleLogin} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900 text-white">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">Cari giriş</h2>
                  <p className="text-sm text-slate-500">Rol bazlı sekreter ve doktor ekranı</p>
                </div>
              </div>

              <label className="mb-4 block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Kullanıcı adı</span>
                <input name="username" className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" placeholder="sekreter veya doktor" />
              </label>
              <label className="mb-2 block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Şifre</span>
                <input name="password" type="password" className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" placeholder="••••••••" />
              </label>
              {loginError && <p className="mb-3 text-sm font-medium text-red-600">{loginError}</p>}
              {appError && <p className="mb-3 text-sm font-medium text-red-600">{appError}</p>}
              <button disabled={saving} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300">
                <ShieldCheck className="h-4 w-4" />
                {saving ? 'Giriş yapılıyor...' : 'Giriş yap'}
              </button>
            </form>
            )}

            {!resetToken && (
              <form onSubmit={handleForgotPassword} className="mt-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Mail className="h-4 w-4 text-emerald-600" />
                  Şifremi unuttum
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    name="identifier"
                    className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                    placeholder="E-posta veya kullanıcı adı"
                  />
                  <button disabled={saving} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:text-slate-300">
                    Reset maili gönder
                  </button>
                </div>
                {resetMessage && <p className="mt-2 text-xs font-medium text-emerald-700">{resetMessage}</p>}
              </form>
            )}
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {!installHidden && (
        <InstallAppPrompt
          canInstall={Boolean(installPrompt)}
          showHelp={showInstallHelp}
          onInstall={handleInstallClick}
          onClose={dismissInstallPrompt}
        />
      )}
      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 lg:px-8">
        <header className="mb-4 border-b border-slate-200 pb-3">
          <div className="mb-3 flex justify-center">
            <Image
              src="/images/logo.png"
              alt="Prof. Dr. Gökçe Özel"
              width={190}
              height={78}
              priority
              className="h-auto w-36 object-contain sm:w-44"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              ['dashboard', 'Dashboard', BarChart3],
              ['entry', 'Cari Kayıtlar', Plus],
              ['reservations', 'Randevular', CalendarDays],
              ['system', 'Sistem', Settings],
            ].map(([tab, label, Icon]) => (
              <button
                key={String(tab)}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition sm:text-sm ${
                  activeTab === tab
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                {String(label)}
                {tab === 'reservations' && pendingAppointmentCount > 0 && (
                  <span className={`ml-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${activeTab === tab ? 'bg-white text-slate-950' : 'bg-red-600 text-white'}`}>
                    {pendingAppointmentCount}
                  </span>
                )}
              </button>
            ))}
            <button
              type="button"
              onClick={refreshCariData}
              disabled={refreshing}
              className="ml-auto inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"
              aria-label="Verileri yenile"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={handleLogout} className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100" aria-label="Çıkış">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {appError && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {appError}
          </div>
        )}

        {pendingAppointmentCount > 0 && (
          <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-bold">{pendingAppointmentCount} yeni randevu talebi var</div>
                <div className="mt-0.5 text-amber-800">
                  En yeni talep: {pendingAppointments[0]?.name || 'Hasta'} · {pendingAppointments[0]?.date || 'Tarih yok'} {pendingAppointments[0]?.startTime || ''}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default' && (
                  <button
                    type="button"
                    onClick={() => void Notification.requestPermission()}
                    className="rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100"
                  >
                    Bildirimleri aç
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveTab('reservations')}
                  className="rounded-lg bg-amber-600 px-3 py-2 text-xs font-bold text-white hover:bg-amber-700"
                >
                  Randevuları gör
                </button>
              </div>
            </div>
          </div>
        )}

        {refreshing && (
          <div className="mb-3 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-700">
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            Yenileniyor
          </div>
        )}

        <section className="mb-4 grid gap-2 rounded-lg border border-slate-200 bg-white p-3 sm:gap-3 lg:grid-cols-[0.85fr_0.85fr_1fr_1fr_auto]">
          <label>
            <span className="mb-1 flex items-center gap-1 text-[11px] font-semibold uppercase text-slate-500"><CalendarDays className="h-3.5 w-3.5" />Başlangıç</span>
            <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:border-emerald-500 sm:text-sm" />
          </label>
          <label>
            <span className="mb-1 flex items-center gap-1 text-[11px] font-semibold uppercase text-slate-500"><CalendarDays className="h-3.5 w-3.5" />Bitiş</span>
            <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:border-emerald-500 sm:text-sm" />
          </label>
          <label>
            <span className="mb-1 block text-[11px] font-semibold uppercase text-slate-500">İşlem grubu</span>
            <select value={serviceFilter} onChange={(event) => setServiceFilter(event.target.value as typeof serviceFilter)} className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:border-emerald-500 sm:text-sm">
              <option>Tümü</option>
              {serviceTypeNames.map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>
          <label>
            <span className="mb-1 block text-[11px] font-semibold uppercase text-slate-500">Hasta ara</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400 sm:top-2.5 sm:h-4 sm:w-4" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full rounded-lg border border-slate-300 py-1.5 pl-8 pr-2.5 text-xs outline-none focus:border-emerald-500 sm:py-2 sm:pl-9 sm:text-sm" placeholder="Ad, telefon, işlem" />
            </div>
          </label>
          <div className="flex items-end">
            <button onClick={exportCsv} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">
              <Download className="h-4 w-4" />
              CSV
            </button>
          </div>
        </section>

        {activeTab === 'entry' && (
          <section className="space-y-4">
            <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Cari hareketler</h2>
                <p className="text-sm text-slate-500">Liste tam ekran görünür; yeni kayıt ayrı pencerede eklenir.</p>
              </div>
              <button
                type="button"
                onClick={() => setEntryModalOpen(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 sm:w-auto"
              >
                <Plus className="h-4 w-4" />
                Cari hareket ekle
              </button>
            </div>

            <EntryTable entries={filteredEntries} onDelete={handleDelete} onShowNote={setNoteEntry} canDelete={user.role === 'doctor'} />
          </section>
        )}

        {entryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-3 sm:items-center sm:p-4">
            <form onSubmit={handleSubmit} className="max-h-[calc(100dvh-1.5rem)] w-full overflow-y-auto rounded-lg border border-slate-200 bg-white p-4 shadow-2xl sm:max-w-3xl sm:p-5">
              <div className="sticky top-0 z-10 -mx-4 -mt-4 mb-5 flex items-start justify-between gap-4 border-b border-slate-100 bg-white px-4 py-3 sm:-mx-5 sm:-mt-5 sm:px-5">
                <div className="flex items-center gap-3">
                  <Receipt className="h-6 w-6 text-emerald-600" />
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">Cari hareket ekle</h2>
                    <p className="text-sm text-slate-500">XLSX şablonundaki günlük giriş alanları</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEntryModalOpen(false)}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                  aria-label="Cari hareket ekleme penceresini kapat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label>
                  <span className="mb-1 block text-sm font-medium text-slate-700">Tarih</span>
                  <input name="date" type="date" defaultValue={today} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                </label>
                <label>
                  <span className="mb-1 block text-sm font-medium text-slate-700">İşlem grubu</span>
                  <select name="serviceType" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                    {serviceTypeNames.map((type) => <option key={type}>{type}</option>)}
                  </select>
                </label>
                <label>
                  <span className="mb-1 block text-sm font-medium text-slate-700">Hasta</span>
                  <input name="patient" required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Hasta adı soyadı" />
                </label>
                <label>
                  <span className="mb-1 block text-sm font-medium text-slate-700">Telefon</span>
                  <input name="phone" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="05xx" />
                </label>
                <label className="sm:col-span-2">
                  <span className="mb-1 block text-sm font-medium text-slate-700">İşlem</span>
                  <input name="procedure" required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Muayene, ameliyat, ozon paketi, botox/dolgu" />
                </label>
                <label>
                  <span className="mb-1 block text-sm font-medium text-slate-700">Tanı</span>
                  <input name="diagnosis" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                </label>
                <label>
                  <span className="mb-1 block text-sm font-medium text-slate-700">Paket / hastane</span>
                  <input name="packageName" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Paket bilgisi" />
                </label>
                <label className="sm:col-span-2">
                  <span className="mb-1 block text-sm font-medium text-slate-700">Hastane</span>
                  <input name="hospital" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Ameliyat için hastane bilgisi" />
                </label>
              </div>

              <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <label className="mb-3 flex items-center gap-3 text-sm font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={hasInsurance}
                    onChange={(event) => setHasInsurance(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  Hastanın sağlık sigortası var
                </label>
                <InsuranceProviderSelect
                  selected={selectedInsuranceProviders}
                  onChange={(next) => {
                    setSelectedInsuranceProviders(next);
                    if (next.length) setHasInsurance(true);
                  }}
                />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {paymentTypes.map((type) => (
                  <label key={type.id}>
                    <span className="mb-1 block text-sm font-medium text-slate-700">{type.name}</span>
                    <input name={`payment-${type.id}`} type="number" min="0" step="0.01" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="0" />
                  </label>
                ))}
                <label>
                  <span className="mb-1 block text-sm font-medium text-slate-700">Gider</span>
                  <input name="expense" type="number" min="0" step="0.01" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="0" />
                </label>
                <label className="sm:col-span-2">
                  <span className="mb-1 block text-sm font-medium text-slate-700">Not</span>
                  <textarea name="note" rows={3} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Ödeme, kontrol veya hasta detayı" />
                </label>
              </div>

              <button disabled={saving} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300">
                <Plus className="h-4 w-4" />
                {saving ? 'Kaydediliyor...' : 'Kaydı ekle'}
              </button>
            </form>
          </div>
        )}

        {serviceTypesModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-3 sm:items-center sm:p-4">
            <section className="max-h-[calc(100dvh-1.5rem)] w-full overflow-y-auto rounded-lg border border-slate-200 bg-white p-4 shadow-2xl sm:max-w-2xl sm:p-5">
              <div className="sticky top-0 z-10 -mx-4 -mt-4 mb-5 flex items-start justify-between gap-4 border-b border-slate-100 bg-white px-4 py-3 sm:-mx-5 sm:-mt-5 sm:px-5">
                <div className="flex items-center gap-3">
                  <Building2 className="h-6 w-6 text-emerald-600" />
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">İşlem grupları</h2>
                    <p className="text-sm text-slate-500">Yeni grup eklenebilir; kullanılmış gruplar silinemez.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setServiceTypesModalOpen(false)}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                  aria-label="İşlem grupları penceresini kapat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateServiceType} className="mb-4 flex flex-col gap-2 sm:flex-row">
                <input
                  value={newServiceType}
                  onChange={(event) => setNewServiceType(event.target.value)}
                  maxLength={80}
                  className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                  placeholder="Yeni işlem grubu"
                />
                <button
                  disabled={serviceTypeSaving}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                >
                  <Plus className="h-4 w-4" />
                  Ekle
                </button>
              </form>
              {serviceTypeError && <p className="mb-3 text-sm font-medium text-red-600">{serviceTypeError}</p>}

              <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                {serviceTypes.map((serviceType) => (
                  <div key={serviceType.id} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0">
                      <div className="truncate font-medium text-slate-900">{serviceType.name}</div>
                      <div className="text-xs text-slate-500">
                        {serviceType.usedCount > 0 ? `${serviceType.usedCount} kayıtta kullanılıyor` : 'Henüz kullanılmadı'}
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={serviceType.usedCount > 0 || serviceTypeSaving}
                      onClick={() => handleDeleteServiceType(serviceType)}
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
                      aria-label={`${serviceType.name} işlem grubunu sil`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {paymentTypesModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-3 sm:items-center sm:p-4">
            <section className="max-h-[calc(100dvh-1.5rem)] w-full overflow-y-auto rounded-lg border border-slate-200 bg-white p-4 shadow-2xl sm:max-w-2xl sm:p-5">
              <div className="sticky top-0 z-10 -mx-4 -mt-4 mb-5 flex items-start justify-between gap-4 border-b border-slate-100 bg-white px-4 py-3 sm:-mx-5 sm:-mt-5 sm:px-5">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-emerald-600" />
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">Tahsilat türleri</h2>
                    <p className="text-sm text-slate-500">Yeni tür eklenebilir; kullanılmış türler silinemez.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPaymentTypesModalOpen(false)}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                  aria-label="Tahsilat türleri penceresini kapat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePaymentType} className="mb-4 flex flex-col gap-2 sm:flex-row">
                <input
                  value={newPaymentType}
                  onChange={(event) => setNewPaymentType(event.target.value)}
                  maxLength={80}
                  className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                  placeholder="Yeni tahsilat türü"
                />
                <button
                  disabled={paymentTypeSaving}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                >
                  <Plus className="h-4 w-4" />
                  Ekle
                </button>
              </form>
              {paymentTypeError && <p className="mb-3 text-sm font-medium text-red-600">{paymentTypeError}</p>}

              <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                {paymentTypes.map((paymentType) => (
                  <div key={paymentType.id} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: paymentType.color }} />
                        <div className="truncate font-medium text-slate-900">{paymentType.name}</div>
                      </div>
                      <div className="text-xs text-slate-500">
                        {paymentType.usedCount > 0 ? `${paymentType.usedCount} kayıtta kullanılıyor` : 'Henüz kullanılmadı'}
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={paymentType.usedCount > 0 || paymentTypeSaving}
                      onClick={() => handleDeletePaymentType(paymentType)}
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
                      aria-label={`${paymentType.name} tahsilat türünü sil`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <section className="flex flex-col gap-5">
            <div className="order-2 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <Metric icon={Wallet} label="Brüt tahsilat" value={formatCurrency(grossIncome)} />
              <Metric icon={Landmark} label="Net" value={formatCurrency(netIncome)} />
              <Metric icon={FileText} label="Kayıt" value={String(summary.count)} />
              <Metric icon={Shield} label="Sigortalı hasta" value={String(summary.insuredCount)} />
              <Metric icon={Stethoscope} label="Sigortadan ödenen" value={formatCurrency(summary.insurance)} />
            </div>

            <div className="order-1 grid gap-4 lg:order-3 lg:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-5">
                <div className="mb-4 flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-emerald-600" />
                  <h2 className="text-lg font-semibold text-slate-950">Tahsilat türlerine göre dağılım</h2>
                </div>
                <div className="grid gap-5 sm:grid-cols-[220px_1fr] sm:items-center">
                  <div className="mx-auto flex h-56 w-56 items-center justify-center rounded-full sm:h-52 sm:w-52" style={{ background: paymentChartBackground }}>
                    <div className="flex h-[7.5rem] w-[7.5rem] flex-col items-center justify-center rounded-full bg-white text-center shadow-sm sm:h-28 sm:w-28">
                      <span className="text-xs font-semibold uppercase text-slate-500">Toplam</span>
                      <span className="text-lg font-bold text-slate-950">{formatCurrency(paymentTotal)}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => setPaymentFilter('all')}
                      className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                        paymentFilter === 'all' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold">Tüm tahsilatlar</span>
                        <span className="text-sm font-semibold">{formatCurrency(paymentTotal)}</span>
                      </div>
                    </button>
                    {paymentBreakdown.map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setPaymentFilter(item.key)}
                        className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                          paymentFilter === item.key ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/10' : 'border-slate-100 hover:bg-slate-50'
                        }`}
                      >
                        <div className="mb-1 flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="truncate text-sm font-medium text-slate-800">{item.label}</span>
                          </div>
                          <span className="text-sm font-semibold text-slate-950">{formatCurrency(item.value)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                            <div className="h-full rounded-full" style={{ width: `${item.percentage}%`, backgroundColor: item.color }} />
                          </div>
                          <span className="w-12 text-right text-xs text-slate-500">%{item.percentage.toFixed(1)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-5">
                <h2 className="mb-4 text-lg font-semibold text-slate-950">İşlem grubuna göre tahsilat</h2>
                <div className="space-y-4">
                  {byService.map((item) => (
                    <div key={item.serviceType}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">{item.serviceType}</span>
                        <span className="text-slate-500">{formatCurrency(item.income)} · {item.count} kayıt</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.max((item.income / maxServiceTotal) * 100, item.income ? 4 : 0)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-5">
                <h2 className="mb-4 text-lg font-semibold text-slate-950">Sigorta sağlayıcısına göre</h2>
                {byInsuranceProvider.length === 0 ? (
                  <p className="text-sm text-slate-500">Seçili dönemde sigortalı hasta kaydı yok.</p>
                ) : (
                  <div className="space-y-3">
                    {byInsuranceProvider.map((item) => (
                      <div key={item.provider} className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 px-3 py-2">
                        <div>
                          <div className="font-medium text-slate-800">{item.provider}</div>
                          <div className="text-xs text-slate-500">{item.count} hasta kaydı</div>
                        </div>
                        <div className="text-right text-sm font-semibold text-emerald-700">{formatCurrency(item.insurance)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-5">
                <h2 className="mb-4 text-lg font-semibold text-slate-950">Son günler net akış</h2>
                {dailyTotals.length === 0 ? (
                  <p className="text-sm text-slate-500">Seçili dönemde kayıt yok.</p>
                ) : (
                  <div className="flex h-64 items-end gap-2 border-b border-slate-200 pt-6">
                    {dailyTotals.map(([date, value]) => (
                      <div key={date} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                        <div className="w-full rounded-t bg-slate-900" style={{ height: `${Math.max((value / maxDailyTotal) * 190, 6)}px` }} title={formatCurrency(value)} />
                        <span className="w-full truncate text-center text-xs text-slate-500">{date.slice(5)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="order-3">
              <EntryTable
                entries={paymentFilteredEntries}
                onDelete={handleDelete}
                onShowNote={setNoteEntry}
                canDelete={user.role === 'doctor'}
                compact
                filterLabel={`${activePaymentLabel} · ${paymentFilteredEntries.length} kayıt`}
              />
            </div>
          </section>
        )}

        {noteEntry && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-3 sm:items-center sm:p-4">
            <section className="max-h-[calc(100dvh-1.5rem)] w-full overflow-y-auto rounded-lg border border-slate-200 bg-white p-4 shadow-2xl sm:max-w-lg sm:p-5">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <StickyNote className="h-6 w-6 text-amber-500" />
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">İşlem notu</h2>
                    <p className="text-sm text-slate-500">{noteEntry.patient} · {noteEntry.date}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNoteEntry(null)}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                  aria-label="Not penceresini kapat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm leading-6 text-slate-800">
                {noteEntry.note}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'reservations' && (
          <section className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">Randevular</h2>
                  <p className="text-sm text-slate-500">Web sitesinden gelen tüm hasta randevu talepleri, dolu saatler ve müsait slotlar.</p>
                </div>
                <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
                  {[
                    ['calendar', 'Takvim'],
                    ['list', 'Liste'],
                    ['table', 'Tablo'],
                    ['settings', 'Ayarlar'],
                  ].map(([view, label]) => (
                    <button
                      key={view}
                      type="button"
                      onClick={() => setAppointmentView(view as typeof appointmentView)}
                      className={`rounded-md px-3 py-1.5 text-xs font-bold transition ${
                        appointmentView === view ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {pendingAppointmentCount > 0 && (
                <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">
                  İşlem bekleyen {pendingAppointmentCount} yeni randevu talebi var.
                </div>
              )}
            </div>

            <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="grid gap-3 lg:grid-cols-[1fr_190px_170px_130px]">
                  <label>
                    <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-500">Randevu ara</span>
                    <input
                      value={appointmentQuery}
                      onChange={(event) => setAppointmentQuery(event.target.value)}
                      placeholder="Hasta, telefon, e-posta, hizmet, durum..."
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                    />
                  </label>
                  <label>
                    <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-500">Durum</span>
                    <select value={appointmentStatusFilter} onChange={(event) => setAppointmentStatusFilter(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500">
                      <option value="all">Tüm durumlar</option>
                      {APPOINTMENT_STATUSES.map((status) => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-500">Sıralama</span>
                    <select value={appointmentSortKey} onChange={(event) => setAppointmentSortKey(event.target.value as AppointmentSortKey)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500">
                      <option value="date">Tarih / saat</option>
                      <option value="name">Hasta adı</option>
                      <option value="status">Durum</option>
                      <option value="service">Hizmet</option>
                    </select>
                  </label>
                  <button
                    type="button"
                    onClick={() => setAppointmentSortDirection((direction) => direction === 'asc' ? 'desc' : 'asc')}
                    className="self-end rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {appointmentSortDirection === 'asc' ? 'Artan' : 'Azalan'}
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span>{filteredReservations.length} randevu gösteriliyor</span>
                  {(appointmentQuery || appointmentStatusFilter !== 'all') && (
                    <button
                      type="button"
                      onClick={() => {
                        setAppointmentQuery('');
                        setAppointmentStatusFilter('all');
                      }}
                      className="rounded-full border border-slate-200 px-2 py-1 font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Filtreleri temizle
                    </button>
                  )}
                </div>
              </div>

              <aside className="rounded-lg border border-slate-200 bg-white p-4">
                <h3 className="text-sm font-bold text-slate-950">Hasta fihristi</h3>
                <p className="mt-1 text-xs text-slate-500">{patientDirectory.length} hasta kaydı</p>
                <div className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
                  {patientDirectory.map((patient) => (
                    <button
                      key={`${patient.name}-${patient.phone}-${patient.email}`}
                      type="button"
                      onClick={() => {
                        setAppointmentQuery(patient.name);
                        setAppointmentView('list');
                      }}
                      className="w-full rounded-lg border border-slate-100 px-3 py-2 text-left hover:bg-slate-50"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="truncate text-sm font-semibold text-slate-900">{patient.name}</span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">{patient.count}</span>
                      </div>
                      <div className="mt-1 truncate text-xs text-slate-500">{patient.phone || patient.email || 'İletişim yok'}</div>
                      <div className="mt-1 text-[11px] text-slate-400">Son randevu: {patient.lastDate || '-'}</div>
                    </button>
                  ))}
                </div>
              </aside>
            </div>

            {appointmentView === 'calendar' && (
              <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <button type="button" onClick={() => setAppointmentCalendarMonth((month) => shiftMonthValue(month, -1))} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                      Önceki
                    </button>
                    <div className="text-center text-sm font-bold text-slate-950">{formatMonthLabel(appointmentCalendarMonth)}</div>
                    <button type="button" onClick={() => setAppointmentCalendarMonth((month) => shiftMonthValue(month, 1))} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                      Sonraki
                    </button>
                  </div>
                  <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day) => <span key={day}>{day}</span>)}
                  </div>
                  <div className="grid grid-cols-7 gap-1.5">
                    {appointmentCalendarCells.map((day, index) => {
                      if (!day) return <span key={`empty-${index}`} />;
                      const dayReservations = reservationsByDate.get(day.date) || [];
                      const isSelected = selectedAppointmentDate === day.date;
                      const hasPending = dayReservations.some((item) => PENDING_APPOINTMENT_STATUSES.has(item.status));
                      return (
                        <button
                          key={day.date}
                          type="button"
                          onClick={() => setSelectedAppointmentDate(day.date)}
                          className={`min-h-20 rounded-lg border p-2 text-left transition ${
                            isSelected
                              ? 'border-slate-950 bg-slate-950 text-white'
                              : hasPending
                                ? 'border-amber-300 bg-amber-50 text-slate-950'
                                : dayReservations.length
                                  ? 'border-emerald-200 bg-emerald-50 text-slate-950'
                                  : day.available
                                    ? 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300'
                                    : 'border-slate-100 bg-slate-50 text-slate-400'
                          }`}
                        >
                          <span className="block text-sm font-bold">{Number(day.date.slice(-2))}</span>
                          <span className="mt-2 block text-[11px]">{dayReservations.length} dolu</span>
                          <span className="block text-[11px]">{day.availableCount || 0} boş</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <h3 className="text-base font-bold text-slate-950">{formatLongDate(selectedAppointmentDate)}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {selectedDateReservations.length} dolu randevu · {availabilitySlots.filter((slot) => slot.available).length} boş slot
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <h4 className="mb-3 text-sm font-bold text-slate-950">Dolu slotlar</h4>
                    {selectedDateReservations.length === 0 ? (
                      <p className="text-sm text-slate-500">Bu gün için kayıtlı randevu yok.</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedDateReservations.map((reservation) => (
                          <div key={reservation.id} className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="font-bold text-slate-950">{reservation.startTime || '-'} · {reservation.name}</div>
                                <div className="text-xs text-slate-600">{reservation.phone} {reservation.email ? `· ${reservation.email}` : ''}</div>
                              </div>
                              <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${appointmentStatusTone(reservation.status)}`}>
                                {appointmentStatusLabel(reservation.status)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <h4 className="mb-3 text-sm font-bold text-slate-950">Boş slotlar</h4>
                    {availabilityLoading ? (
                      <p className="text-sm text-slate-500">Müsait saatler yükleniyor...</p>
                    ) : availabilitySlots.filter((slot) => slot.available).length === 0 ? (
                      <p className="text-sm text-slate-500">{availabilityReason || 'Bu gün için boş slot yok.'}</p>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {availabilitySlots.filter((slot) => slot.available).map((slot) => (
                          <span key={slot.startTime} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-center text-sm font-semibold text-slate-700">
                            {slot.startTime} - {slot.endTime}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {appointmentView === 'table' && (
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-4 py-3">
                          <button type="button" onClick={() => updateAppointmentSort('date')} className="inline-flex items-center gap-1 hover:text-slate-900">
                            Tarih {appointmentSortKey === 'date' ? (appointmentSortDirection === 'asc' ? '↑' : '↓') : ''}
                          </button>
                        </th>
                        <th className="px-4 py-3">Saat</th>
                        <th className="px-4 py-3">
                          <button type="button" onClick={() => updateAppointmentSort('name')} className="inline-flex items-center gap-1 hover:text-slate-900">
                            Hasta {appointmentSortKey === 'name' ? (appointmentSortDirection === 'asc' ? '↑' : '↓') : ''}
                          </button>
                        </th>
                        <th className="px-4 py-3">İletişim</th>
                        <th className="px-4 py-3">
                          <button type="button" onClick={() => updateAppointmentSort('service')} className="inline-flex items-center gap-1 hover:text-slate-900">
                            Hizmet {appointmentSortKey === 'service' ? (appointmentSortDirection === 'asc' ? '↑' : '↓') : ''}
                          </button>
                        </th>
                        <th className="px-4 py-3">
                          <button type="button" onClick={() => updateAppointmentSort('status')} className="inline-flex items-center gap-1 hover:text-slate-900">
                            Durum {appointmentSortKey === 'status' ? (appointmentSortDirection === 'asc' ? '↑' : '↓') : ''}
                          </button>
                        </th>
                        <th className="px-4 py-3">Aksiyon</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredReservations.map((reservation) => (
                        <tr key={reservation.id} className={PENDING_APPOINTMENT_STATUSES.has(reservation.status) ? 'bg-amber-50/60' : undefined}>
                          <td className="px-4 py-3 font-semibold text-slate-900">{reservation.date || '-'}</td>
                          <td className="px-4 py-3 text-slate-700">{reservation.startTime || '-'}{reservation.endTime ? ` - ${reservation.endTime}` : ''}</td>
                          <td className="px-4 py-3 font-semibold text-slate-900">{reservation.name}</td>
                          <td className="px-4 py-3 text-slate-600">{reservation.phone}<br />{reservation.email || '-'}</td>
                          <td className="px-4 py-3 text-slate-600">{reservation.service || '-'}</td>
                          <td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs font-bold ${appointmentStatusTone(reservation.status)}`}>{appointmentStatusLabel(reservation.status)}</span></td>
                          <td className="px-4 py-3">
                            <div className="flex min-w-44 flex-col gap-2">
                              <select
                                value={reservation.status || 'pending'}
                                disabled={saving}
                                onChange={(event) => updateReservationStatus(reservation.id, event.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50 disabled:text-slate-300"
                              >
                                {APPOINTMENT_STATUSES.map((status) => (
                                  <option key={status.value} value={status.value}>{status.label}</option>
                                ))}
                              </select>
                              {reservation.status === 'pending_confirmation' && reservation.email && (
                                <button
                                  type="button"
                                  disabled={reminderSendingId === reservation.id}
                                  onClick={() => sendReservationReminder(reservation.id)}
                                  className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-100 disabled:cursor-wait disabled:opacity-60"
                                >
                                  {reminderSendingId === reservation.id ? 'Gönderiliyor...' : 'Onay maili hatırlat'}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredReservations.length === 0 && <div className="p-6 text-sm text-slate-500">Henüz randevu yok.</div>}
              </div>
            )}

            {appointmentView === 'list' && (
              <div className="grid gap-3">
                {filteredReservations.length === 0 ? (
                  <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500">Henüz randevu yok.</div>
                ) : filteredReservations.map((reservation) => (
                  <article
                    key={reservation.id}
                    className={`rounded-lg border bg-white p-4 ${
                      PENDING_APPOINTMENT_STATUSES.has(reservation.status)
                        ? 'border-amber-300 shadow-sm shadow-amber-100'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="grid gap-4 lg:grid-cols-[180px_1fr_180px]">
                      <div>
                        <div className="text-sm font-bold text-slate-950">{reservation.date || '-'}</div>
                        <div className="mt-1 text-2xl font-bold text-emerald-700">{reservation.startTime || '-'} </div>
                        <div className="text-xs text-slate-500">{reservation.endTime ? `${reservation.startTime} - ${reservation.endTime}` : 'Saat seçilmedi'}</div>
                      </div>
                      <div>
                        <div className="text-base font-semibold text-slate-950">{reservation.name}</div>
                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                          <a href={`tel:${reservation.phone}`} className="hover:text-emerald-700">{reservation.phone}</a>
                          {reservation.email && <a href={`mailto:${reservation.email}`} className="hover:text-emerald-700">{reservation.email}</a>}
                        </div>
                        <div className="mt-2 text-sm text-slate-700">{reservation.service || 'Hizmet belirtilmedi'}</div>
                        {reservation.message && <p className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm text-slate-600">{reservation.message}</p>}
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className={`rounded-full px-3 py-1 text-center text-xs font-bold uppercase tracking-wide ${appointmentStatusTone(reservation.status)}`}>
                          {appointmentStatusLabel(reservation.status)}
                        </span>
                        <select
                          value={reservation.status || 'pending'}
                          disabled={saving}
                          onChange={(event) => updateReservationStatus(reservation.id, event.target.value)}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none hover:bg-slate-50 disabled:cursor-wait disabled:text-slate-300"
                        >
                          {APPOINTMENT_STATUSES.map((status) => (
                            <option key={status.value} value={status.value}>{status.label}</option>
                          ))}
                        </select>
                        {reservation.status === 'pending_confirmation' && reservation.email && (
                          <button
                            type="button"
                            disabled={reminderSendingId === reservation.id}
                            onClick={() => sendReservationReminder(reservation.id)}
                            className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800 hover:bg-amber-100 disabled:cursor-wait disabled:opacity-60"
                          >
                            {reminderSendingId === reservation.id ? 'Gönderiliyor...' : 'Onay maili hatırlat'}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {appointmentView === 'settings' && (
              <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
                {settingsLoading ? (
                  <div className="text-center text-sm text-slate-500 py-10">Ayarlar yükleniyor...</div>
                ) : (
                  <>
                    <form onSubmit={saveReservationSettings} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                      <h2 className="mb-4 text-lg font-bold text-slate-950">Randevu Sistemi Ayarları</h2>
                      <div className="grid gap-6">
                        <label className="flex items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-emerald-900">
                          <input type="checkbox" name="isEnabled" defaultChecked={reservationSettings?.isEnabled ?? true} className="h-5 w-5 accent-emerald-600" />
                          <span className="font-semibold">Online randevu alımı açık</span>
                        </label>
                        
                        <div>
                          <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Çalışma Günleri</div>
                          <div className="flex flex-wrap gap-2">
                            {['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'].map((day, i) => (
                              <label key={i} className="flex items-center gap-1.5 rounded-md bg-slate-50 px-2.5 py-1.5 text-sm font-medium text-slate-700">
                                <input type="checkbox" name={`day_${i}`} defaultChecked={(reservationSettings?.workingDays ?? [1, 2, 3, 4, 5, 6]).includes(i)} />
                                {day}
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <label className="block">
                            <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Gün Başlangıç</span>
                            <input type="time" name="dayStart" defaultValue={reservationSettings?.dayStart ?? '10:00'} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                          </label>
                          <label className="block">
                            <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Gün Bitiş</span>
                            <input type="time" name="dayEnd" defaultValue={reservationSettings?.dayEnd ?? '18:00'} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                          </label>
                          <label className="block">
                            <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Randevu Süresi (dk)</span>
                            <input type="number" name="slotMinutes" defaultValue={reservationSettings?.slotMinutes ?? 30} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                          </label>
                          <label className="block">
                            <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Mola / Ara (dk)</span>
                            <input type="number" name="bufferMinutes" defaultValue={reservationSettings?.bufferMinutes ?? 0} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                          </label>
                          <label className="block">
                            <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Slot Kapasitesi</span>
                            <input type="number" name="maxPerSlot" defaultValue={reservationSettings?.maxPerSlot ?? 1} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                          </label>
                          <label className="block">
                            <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Min. Bildirim (saat)</span>
                            <input type="number" name="minNoticeHours" defaultValue={reservationSettings?.minNoticeHours ?? 2} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                          </label>
                          <label className="block">
                            <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">İleriye Dönük Kapsam (gün)</span>
                            <input type="number" name="bookingHorizonDays" defaultValue={reservationSettings?.bookingHorizonDays ?? 60} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                          </label>
                        </div>
                        
                        <button disabled={saving} className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white disabled:bg-slate-400">
                          {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
                        </button>
                      </div>
                    </form>

                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                      <h2 className="mb-4 text-lg font-bold text-slate-950">Kapalı özel tarihler</h2>
                      <form onSubmit={addBlackout} className="mb-6 grid gap-3">
                        <label className="block">
                          <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Tarih</span>
                          <input required name="date" type="date" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                        </label>
                        <input name="reason" placeholder="Açıklama: Resmi tatil, kongre, izin..." className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                          <input type="checkbox" name="isFullDay" defaultChecked />
                          Tüm gün kapalı
                        </label>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="block">
                            <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Kısmi Başlangıç</span>
                            <input type="time" name="startTime" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                          </label>
                          <label className="block">
                            <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Kısmi Bitiş</span>
                            <input type="time" name="endTime" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                          </label>
                        </div>
                        <button disabled={saving} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white disabled:bg-slate-400">
                          {saving ? 'Ekleniyor...' : 'Kapalı tarih ekle'}
                        </button>
                      </form>

                      <div className="divide-y divide-slate-100">
                        {reservationBlackouts.map((item) => (
                          <div key={item.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                            <div>
                              <div className="font-semibold text-slate-900">{new Date(item.date).toLocaleDateString('tr-TR')}</div>
                              <div className="text-slate-500">{item.isFullDay ? 'Tüm gün' : `${item.startTime || '-'} - ${item.endTime || '-'}`} · {item.reason || 'Kapalı'}</div>
                            </div>
                            <button onClick={() => deleteBlackout(item.id)} disabled={saving} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50">
                              Sil
                            </button>
                          </div>
                        ))}
                        {reservationBlackouts.length === 0 && (
                          <div className="text-sm text-slate-500 py-2">Kapalı tarih bulunmuyor.</div>
                        )}
                      </div>
                    </section>
                  </>
                )}
              </div>
            )}
          </section>
        )}

        {activeTab === 'system' && (
          <section className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <button
                type="button"
                onClick={() => setServiceTypesModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Building2 className="h-4 w-4" />
                İşlem grupları
              </button>
              <button
                type="button"
                onClick={() => setPaymentTypesModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <CreditCard className="h-4 w-4" />
                Tahsilat türleri
              </button>
              <button
                type="button"
                onClick={refreshCariData}
                disabled={refreshing}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Yenile
              </button>
              <div className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-500">
                <UserRound className="h-4 w-4" />
                {user.role === 'doctor' ? 'Doktor' : 'Sekreter'}
              </div>
            </div>

            <section className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="mb-4 flex items-center gap-2">
                <UserRound className="h-5 w-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-slate-950">Hesap ayarları</h2>
              </div>
              <form key={`${user.username}-${user.email || ''}`} onSubmit={handleAccountUpdate} className="grid gap-4 lg:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">Kullanıcı adı</span>
                  <input
                    name="username"
                    defaultValue={user.username}
                    minLength={3}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                    placeholder="kullanıcı adı"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">E-posta</span>
                  <input
                    name="email"
                    type="email"
                    defaultValue={user.email || ''}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                    placeholder="ornek@domain.com"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">Mevcut şifre *</span>
                  <input
                    name="currentPassword"
                    type="password"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                    placeholder="Değişiklikleri onaylamak için"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">Yeni şifre</span>
                  <input
                    name="newPassword"
                    type="password"
                    minLength={8}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                    placeholder="Boş bırakılırsa değişmez"
                  />
                </label>
                <div className="lg:col-span-2">
                  {accountError && <p className="mb-3 text-sm font-medium text-red-600">{accountError}</p>}
                  {accountSuccess && <p className="mb-3 text-sm font-medium text-emerald-700">{accountSuccess}</p>}
                  <button
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    {saving ? 'Kaydediliyor...' : 'Hesabı güncelle'}
                  </button>
                </div>
              </form>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-slate-950">İşlem logları</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {logs.length === 0 ? (
                  <p className="text-sm text-slate-500">Henüz log yok.</p>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="grid gap-1 py-3 text-sm md:grid-cols-[180px_140px_130px_1fr]">
                      <span className="text-slate-500">{new Date(log.at).toLocaleString('tr-TR')}</span>
                      <span className="font-medium text-slate-800">{log.user}</span>
                      <span className="text-emerald-700">{log.action}</span>
                      <span className="text-slate-600">{log.detail}</span>
                    </div>
                  ))
                )}
              </div>
            </section>
          </section>
        )}
      </div>
    </main>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Wallet; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-slate-950">{value}</div>
    </div>
  );
}

function InstallAppPrompt({
  canInstall,
  showHelp,
  onInstall,
  onClose,
}: {
  canInstall: boolean;
  showHelp: boolean;
  onInstall: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-lg border border-emerald-200 bg-white p-4 shadow-xl sm:bottom-5">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
          <Smartphone className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-950">Cari Takip uygulamasını ana ekrana ekle</h2>
              <p className="mt-1 text-sm leading-5 text-slate-600">
                Uygulama simgesiyle hızlı açılır; tarayıcı adresiyle uğraşmadan kullanılır.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
              aria-label="Kurulum önerisini kapat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {showHelp && !canInstall && (
            <div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600">
              <div className="mb-1 flex items-center gap-2 font-semibold text-slate-800">
                <Share2 className="h-4 w-4" />
                iPhone / Safari
              </div>
              Paylaş düğmesine bas, ardından <span className="font-semibold">Ana Ekrana Ekle</span> seçeneğini seç.
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onInstall}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              <Smartphone className="h-4 w-4" />
              {canInstall ? 'Uygulama olarak yükle' : 'Nasıl eklenir?'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Daha sonra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InsuranceProviderSelect({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (providers: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState('');
  const normalizedTerm = term.trim().toLocaleLowerCase('tr-TR');
  const filteredCompanies = insuranceCompanies.filter((company) =>
    company.toLocaleLowerCase('tr-TR').includes(normalizedTerm)
  );

  const toggleProvider = (provider: string) => {
    if (selected.includes(provider)) {
      onChange(selected.filter((item) => item !== provider));
      return;
    }
    onChange([...selected, provider]);
  };

  return (
    <div className="relative">
      <span className="mb-1 block text-sm font-medium text-slate-700">Sigorta sağlayıcısı</span>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex min-h-10 w-full items-center justify-between gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-left text-sm"
      >
        <span className="flex min-w-0 flex-1 flex-wrap gap-1">
          {selected.length === 0 ? (
            <span className="text-slate-400">Şirket ara ve birden fazla seç</span>
          ) : (
            selected.map((provider) => (
              <span key={provider} className="inline-flex max-w-full items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                <Building2 className="h-3 w-3 shrink-0" />
                <span className="truncate">{provider}</span>
              </span>
            ))
          )}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
          <div className="relative mb-2">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-500"
              placeholder="Allianz, SGK, Aksigorta..."
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filteredCompanies.length === 0 ? (
              <p className="px-3 py-2 text-sm text-slate-500">Sonuç bulunamadı.</p>
            ) : (
              filteredCompanies.map((company) => (
                <button
                  key={company}
                  type="button"
                  onClick={() => toggleProvider(company)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                    selected.includes(company) ? 'font-semibold text-emerald-700' : 'text-slate-700'
                  }`}
                >
                  <span>{company}</span>
                  {selected.includes(company) && <X className="h-4 w-4" />}
                </button>
              ))
            )}
          </div>
          <div className="mt-2 flex justify-end border-t border-slate-100 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white">
              Tamam
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function EntryTable({
  entries,
  onDelete,
  onShowNote,
  canDelete,
  compact = false,
  filterLabel,
}: {
  entries: CariEntry[];
  onDelete: (id: string) => void;
  onShowNote: (entry: CariEntry) => void;
  canDelete: boolean;
  compact?: boolean;
  filterLabel?: string;
}) {
  type SortKey = 'date' | 'patient' | 'serviceType' | 'procedure' | 'insurance' | 'payment' | 'expense' | 'net' | 'createdBy';
  const [tableQuery, setTableQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const tableEntries = useMemo(() => {
    const normalizedQuery = tableQuery.trim().toLocaleLowerCase('tr-TR');

    const searchedEntries = normalizedQuery
      ? entries.filter((entry) =>
          [
            entry.date,
            entry.patient,
            entry.phone,
            entry.serviceType,
            entry.procedure,
            entry.diagnosis,
            entry.packageName,
            entry.hospital,
            entry.note,
            entry.createdBy,
            ...entry.insuranceProviders,
            ...Object.keys(entry.payments || {}),
          ]
            .join(' ')
            .toLocaleLowerCase('tr-TR')
            .includes(normalizedQuery)
        )
      : entries;

    const valueFor = (entry: CariEntry): string | number => {
      if (sortKey === 'insurance') return paidByInsurance(entry);
      if (sortKey === 'payment') return totalIncome(entry);
      if (sortKey === 'expense') return entry.expense;
      if (sortKey === 'net') return totalIncome(entry) - entry.expense;
      return String(entry[sortKey] || '').toLocaleLowerCase('tr-TR');
    };

    return [...searchedEntries].sort((a, b) => {
      const aValue = valueFor(a);
      const bValue = valueFor(b);
      const result = typeof aValue === 'number' && typeof bValue === 'number'
        ? aValue - bValue
        : String(aValue).localeCompare(String(bValue), 'tr-TR');
      return sortDirection === 'asc' ? result : -result;
    });
  }, [entries, sortDirection, sortKey, tableQuery]);

  const toggleSort = (nextKey: SortKey) => {
    if (sortKey === nextKey) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortKey(nextKey);
    setSortDirection(nextKey === 'date' || nextKey === 'payment' || nextKey === 'net' ? 'desc' : 'asc');
  };

  const SortHeader = ({ label, column }: { label: string; column: SortKey }) => (
    <button
      type="button"
      onClick={() => toggleSort(column)}
      className="inline-flex items-center gap-1 whitespace-nowrap text-left font-semibold uppercase text-slate-500 hover:text-slate-900"
    >
      {label}
      <ArrowUpDown className={`h-3.5 w-3.5 ${sortKey === column ? 'text-slate-900' : 'text-slate-300'}`} />
    </button>
  );

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Cari hareketler</h2>
          <p className="text-sm text-slate-500">{filterLabel || `${tableEntries.length} kayıt listeleniyor`}</p>
        </div>
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            value={tableQuery}
            onChange={(event) => setTableQuery(event.target.value)}
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-500"
            placeholder="Tabloda ara"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3"><SortHeader label="Tarih" column="date" /></th>
              <th className="px-4 py-3"><SortHeader label="Hasta" column="patient" /></th>
              <th className="px-4 py-3"><SortHeader label="Birim" column="serviceType" /></th>
              {!compact && <th className="px-4 py-3"><SortHeader label="İşlem" column="procedure" /></th>}
              <th className="px-4 py-3"><SortHeader label="Sigorta" column="insurance" /></th>
              <th className="px-4 py-3"><SortHeader label="Ödeme" column="payment" /></th>
              <th className="px-4 py-3"><SortHeader label="Gider" column="expense" /></th>
              <th className="px-4 py-3"><SortHeader label="Net" column="net" /></th>
              <th className="px-4 py-3"><SortHeader label="Kayıt" column="createdBy" /></th>
              {canDelete && <th className="px-4 py-3">Sil</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tableEntries.length === 0 ? (
              <tr>
                <td colSpan={canDelete ? 10 : 9} className="px-4 py-8 text-center text-slate-500">Seçili filtrelerde cari hareket yok.</td>
              </tr>
            ) : (
              tableEntries.map((entry) => {
                const insurancePayment = paidByInsurance(entry);
                const paymentLine = paymentDetails(entry)
                  .map(([name, value]) => `${name} ${formatCurrency(Number(value))}`)
                  .join(' · ');

                return (
                <tr key={entry.id} className="align-top">
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{entry.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 font-semibold text-slate-900">
                      <span>{entry.patient}</span>
                      {entry.note && (
                        <button
                          type="button"
                          onClick={() => onShowNote(entry)}
                          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100"
                          aria-label={`${entry.patient} işlem notunu göster`}
                          title="İşlem notu"
                        >
                          <StickyNote className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div className="text-xs text-slate-500">{entry.phone || 'Telefon yok'}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{entry.serviceType}</td>
                  {!compact && (
                    <td className="min-w-56 px-4 py-3 text-slate-600">
                      <div>{entry.procedure}</div>
                      <div className="text-xs text-slate-400">{entry.diagnosis || entry.packageName || entry.hospital}</div>
                    </td>
                  )}
                  <td className="min-w-48 px-4 py-3">
                    <div className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${entry.hasInsurance ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      <Shield className="h-3.5 w-3.5" />
                      {entry.hasInsurance ? 'Var' : 'Yok'}
                    </div>
                    {entry.insuranceProviders.length > 0 && (
                      <div className="mt-1 text-xs text-slate-500">{entry.insuranceProviders.join(', ')}</div>
                    )}
                    {insurancePayment > 0 && (
                      <div className="mt-1 text-xs font-semibold text-emerald-700">{formatCurrency(insurancePayment)}</div>
                    )}
                  </td>
                  <td className="min-w-44 px-4 py-3">
                    <div className="font-semibold text-emerald-700">{formatCurrency(totalIncome(entry))}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {paymentLine || 'Tahsilat yok'}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{formatCurrency(entry.expense)}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-950">{formatCurrency(totalIncome(entry) - entry.expense)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">{entry.createdBy}</td>
                  {canDelete && (
                    <td className="px-4 py-3">
                      <button onClick={() => onDelete(entry.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-600 hover:bg-red-50" aria-label="Kaydı sil">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  )}
                </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React from 'react';

interface NawafilTiming {
  name: string;
  arabicName: string;
  startTime: string;
  endTime: string;
  description: string;
  rakats: string;
  benefits: string;
}

interface PrayerData {
  formattedTodayData: {
    timings: {
      Fajr: string;
      Sunrise: string;
      Dhuhr: string;
      Asr: string;
      Maghrib: string;
      Isha: string;
    };
    date: string;
    month: string;
    hijriDate: string;
    hijriMonth: string;
    hijriYear: string;
    nextPrayer: string;
    nextPrayerTime: number;
  };
}

const NawafilTimesSection = (prayerData: any) => {
  const data = prayerData.data.formattedTodayData;
  
  // Helper function to parse time string and convert to minutes
  const parseTimeToMinutes = (timeStr: string): number => {
    const [time, timezone] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Helper function to convert minutes to time string
  const minutesToTimeString = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Calculate nawafil times based on main prayer times
  const calculateNawafilTimes = (): NawafilTiming[] => {
    const fajrMinutes = parseTimeToMinutes(data.timings.Fajr);
    const sunriseMinutes = parseTimeToMinutes(data.timings.Sunrise);
    const dhuhrMinutes = parseTimeToMinutes(data.timings.Dhuhr);
    const asrMinutes = parseTimeToMinutes(data.timings.Asr);
    const maghribMinutes = parseTimeToMinutes(data.timings.Maghrib);
    const ishaMinutes = parseTimeToMinutes(data.timings.Isha);
    
    // Calculate midnight (Islamic midnight)
    const midnightMinutes = ishaMinutes + ((24 * 60) - ishaMinutes + fajrMinutes) / 2;
    const normalizedMidnight = midnightMinutes >= 24 * 60 ? midnightMinutes - 24 * 60 : midnightMinutes;
    
    // Calculate last third of night
    const lastThirdStart = normalizedMidnight + ((fajrMinutes + 24 * 60 - normalizedMidnight) / 3);
    const normalizedLastThird = lastThirdStart >= 24 * 60 ? lastThirdStart - 24 * 60 : lastThirdStart;

    return [
      {
        name: 'Tahajjud',
        arabicName: 'صلاة التهجد',
        startTime: minutesToTimeString(normalizedLastThird),
        endTime: minutesToTimeString(fajrMinutes - 10),
        description: 'The night prayer offered in the last third of the night. It is the most blessed time for supplication and remembrance of Allah.',
        rakats: '2-12 Rakats (minimum 2)',
        benefits: 'Spiritual purification, closeness to Allah, and answered prayers'
      },
      {
        name: 'Ishraq',
        arabicName: 'صلاة الإشراق',
        startTime: minutesToTimeString(sunriseMinutes + 15),
        endTime: minutesToTimeString(sunriseMinutes + 45),
        description: 'The sunrise prayer offered 15-20 minutes after sunrise. It brings the reward of a complete Hajj and Umrah.',
        rakats: '2-4 Rakats',
        benefits: 'Reward equivalent to Hajj and Umrah, spiritual enlightenment'
      },
      {
        name: 'Duha (Chasht)',
        arabicName: 'صلاة الضحى',
        startTime: minutesToTimeString(sunriseMinutes + 45),
        endTime: minutesToTimeString(dhuhrMinutes - 10),
        description: 'The forenoon prayer offered when the sun has risen high. Best time is mid-morning when the sun is at its peak.',
        rakats: '2-8 Rakats (preferably 4)',
        benefits: 'Daily sustenance, energy, and barakah in work and life'
      },
      {
        name: 'Awwabin',
        arabicName: 'صلاة الأوابين',
        startTime: minutesToTimeString(maghribMinutes + 10),
        endTime: minutesToTimeString(ishaMinutes - 10),
        description: 'The prayer of the repentant ones, offered between Maghrib and Isha. Perfect time for seeking forgiveness.',
        rakats: '2-6 Rakats',
        benefits: 'Forgiveness of sins, spiritual cleansing, and acceptance of repentance'
      },
      {
        name: 'Tahiyyat al-Masjid',
        arabicName: 'تحية المسجد',
        startTime: 'Upon entering mosque',
        endTime: 'Before sitting',
        description: 'The greeting of the mosque prayer, offered immediately upon entering the mosque before sitting down.',
        rakats: '2 Rakats',
        benefits: 'Respect for the sacred space, spiritual preparation for worship'
      },
      {
        name: 'Tawbah',
        arabicName: 'صلاة التوبة',
        startTime: 'Anytime (except forbidden times)',
        endTime: 'No specific end time',
        description: 'The prayer of repentance offered when seeking forgiveness from Allah for sins committed.',
        rakats: '2 Rakats',
        benefits: 'Forgiveness of sins, spiritual purification, renewed faith'
      }
    ];
  };

  const nawafilTimes = calculateNawafilTimes();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Nawafil Prayer Times
          <span className="text-lg font-normal text-gray-600 mr-2 float-right">
            صلوات النوافل
          </span>
        </h2>
        <p className="text-gray-600 text-sm">
          {data.date} • {data.hijriDate} {data.hijriMonth} {data.hijriYear}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nawafilTimes.map((nawafil, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg text-gray-800">{nawafil.name}</h3>
                <p className="text-sm text-gray-600 font-arabic">{nawafil.arabicName}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-700 font-medium">
                  {nawafil.startTime === 'Upon entering mosque' ? (
                    <span className="text-blue-600">Upon entering mosque</span>
                  ) : nawafil.startTime === 'Anytime (except forbidden times)' ? (
                    <span className="text-green-600">Anytime</span>
                  ) : (
                    <span>
                      {nawafil.startTime} - {nawafil.endTime}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Rakats:</span>
                <span className="font-medium text-gray-800">{nawafil.rakats}</span>
              </div>
            </div>

            <div className="mb-3">
              <p className="text-sm text-gray-700 leading-relaxed">
                {nawafil.description}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-2">
              <p className="text-xs text-gray-600">
                <span className="font-medium">Benefits:</span> {nawafil.benefits}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-bold text-blue-800 mb-2">Important Notes:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Avoid praying nawafil during forbidden times (sunrise, sunset, and when sun is at zenith)</li>
          <li>• Nawafil prayers can be offered individually or in congregation</li>
          <li>• Each prayer can be performed with different number of rakats as per your capacity</li>
          <li>• Make dua and dhikr during and after these prayers for maximum benefit</li>
        </ul>
      </div>
    </div>
  );
};

export default NawafilTimesSection;
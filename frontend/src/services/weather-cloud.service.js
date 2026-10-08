/**
 * Weather & Cloud Hunter Telemetry Microservice
 * Handles real-time cloud sea probability, humidity, inversion layer data,
 * and high-altitude meteorological metrics for Vietnam's northwestern summits.
 */

// Ground stations telemetry data
const SPOT_TELEMETRY = [
  {
    id: 'ta-xua',
    name: 'Tà Xùa (Bắc Yên, Sơn La)',
    coordinates: "21°24'N 104°18'E",
    elevation: '2.865m',
    cloudProbability: 94,
    status: 'Biển mây cuồn cuộn (Tuyệt hảo)',
    temperature: '14°C',
    humidity: '96%',
    windSpeed: '4.8 km/h',
    inversionLayer: '2.100m - 2.600m',
    sunrise: '05:28 AM',
    bestWindow: '05:30 - 07:30',
    conditions: 'Nắng ấm trên nền mây trắng, gió nhẹ xuôi thung lũng Háng Đồng',
    trend: 'stable'
  },
  {
    id: 'ha-giang',
    name: 'Mã Pí Lèng (Hà Giang)',
    coordinates: "23°14'N 105°24'E",
    elevation: '1.500m - 2.000m',
    cloudProbability: 86,
    status: 'Mây luồn Hẻm Tu Sản',
    temperature: '17°C',
    humidity: '88%',
    windSpeed: '9.2 km/h',
    inversionLayer: '1.200m - 1.700m',
    sunrise: '05:22 AM',
    bestWindow: '06:00 - 08:30',
    conditions: 'Sương bạc vắt ngang sườn đá vôi, lòng sông Nho Quế lấp lánh',
    trend: 'rising'
  },
  {
    id: 'y-ty',
    name: 'Y Tý - Ngải Thầu (Bát Xát, Lào Cai)',
    coordinates: "22°37'N 103°36'E",
    elevation: '2.000m',
    cloudProbability: 91,
    status: 'Biển mây tràn qua nóc nhà trình tường',
    temperature: '12°C',
    humidity: '98%',
    windSpeed: '3.5 km/h',
    inversionLayer: '1.800m - 2.200m',
    sunrise: '05:30 AM',
    bestWindow: '05:45 - 08:00',
    conditions: 'Khối mây tĩnh tích tụ dày đặc thung lũng, phủ kín ruộng bậc thang',
    trend: 'peak'
  },
  {
    id: 'fansipan',
    name: 'Kỳ Đài Fansipan (Sa Pa)',
    coordinates: "22°18'N 103°46'E",
    elevation: '3.143m',
    cloudProbability: 89,
    status: 'Đại dương mây dưới chân Phật',
    temperature: '8°C',
    humidity: '92%',
    windSpeed: '12.0 km/h',
    inversionLayer: '2.400m - 2.900m',
    sunrise: '05:25 AM',
    bestWindow: '05:30 - 07:00',
    conditions: 'Trời trong veo đỉnh chóp, tầng mây cuộn sóng dưới 2.500m',
    trend: 'stable'
  },
  {
    id: 'moc-chau',
    name: 'Đỉnh Pha Luông & Đồi Chè (Mộc Châu)',
    coordinates: "20°50'N 104°39'E",
    elevation: '2.000m',
    cloudProbability: 76,
    status: 'Mây lơ lửng đồi chè & vách đá',
    temperature: '16°C',
    humidity: '84%',
    windSpeed: '7.1 km/h',
    inversionLayer: '1.400m - 1.800m',
    sunrise: '05:31 AM',
    bestWindow: '06:15 - 08:15',
    conditions: 'Sương sớm tan dần khi nắng lên, thung lũng mận ngập sương mờ',
    trend: 'falling'
  }
];

export const weatherCloudService = {
  /**
   * Get all live cloud hunting stations telemetry
   */
  async getAllSpotTelemetry() {
    // Simulated microservice latency (50ms)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(SPOT_TELEMETRY);
      }, 50);
    });
  },

  /**
   * Get specific telemetry by spot ID
   */
  async getSpotTelemetry(spotId) {
    const item = SPOT_TELEMETRY.find((s) => s.id === spotId) || SPOT_TELEMETRY[0];
    return item;
  },

  /**
   * Subscribe to live simulated telemetry radar pulses
   */
  subscribeRadarUpdates(callback) {
    const interval = setInterval(() => {
      const jitter = (Math.random() - 0.5) * 1.5;
      const updated = SPOT_TELEMETRY.map((s) => {
        const newProb = Math.min(99, Math.max(50, Math.round(s.cloudProbability + (Math.random() - 0.5) * 2)));
        return {
          ...s,
          cloudProbability: newProb,
          windSpeed: (parseFloat(s.windSpeed) + jitter * 0.1).toFixed(1) + ' km/h'
        };
      });
      callback(updated);
    }, 6000);

    return () => clearInterval(interval);
  }
};

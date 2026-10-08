/**
 * Itinerary & Community Routes Microservice
 * Provides curated mountain routes, safety alerts, and packing essentials.
 */

const CURATED_ITINERARIES = [
  {
    id: 'it-taxua-2n1d',
    destinationId: 'ta-xua',
    title: 'Săn Mây Tà Xùa 2N1Đ - Đỉnh Gió & Sống Lưng Khủng Long',
    duration: '2 Ngày 1 Đêm',
    elevationGain: '+1.600m',
    difficulty: 'Dễ - Trung bình',
    cost: '1.200.000 - 1.800.000 VNĐ',
    highlights: ['Sống lưng khủng long Háng Đồng', 'Cà phê Mị Ơi đón hoàng hôn', 'Cây cô đơn Tà Xùa', 'Biển mây đỉnh Gió'],
    schedule: [
      { time: 'Ngày 1 - 06:00', task: 'Xuất phát từ Hà Nội đi Bắc Yên (xe máy/limousine)' },
      { time: 'Ngày 1 - 14:00', task: 'Check-in homestay ngắm thung lũng, thưởng trà Shan Tuyết cổ thụ' },
      { time: 'Ngày 1 - 17:30', task: 'Đón hoàng hôn nhuộm hồng biển mây tại Mỏm Cá Heo & Cây cô đơn' },
      { time: 'Ngày 2 - 05:15', task: 'Thức giấc săn biển mây bình minh tại Sống Lưng Khủng Long' },
      { time: 'Ngày 2 - 11:30', task: 'Ăn trưa đặc sản gà đồi, lợn bản và chuẩn bị về lại Hà Nội' }
    ]
  },
  {
    id: 'it-hagiang-3n2d',
    destinationId: 'ha-giang',
    title: 'Vòng Cung Hạnh Phúc - Mã Pí Lèng & Hẻm Tu Sản 3N2Đ',
    duration: '3 Ngày 2 Đêm',
    elevationGain: '+2.100m',
    difficulty: 'Trung bình - Thử thách',
    cost: '2.500.000 - 3.500.000 VNĐ',
    highlights: ['Dốc Thẩm Mã hùng vĩ', 'Hẻm vực Tu Sản sâu nhất Đông Nam Á', 'Chèo thuyền trên dòng Nho Quế', 'Đèo Mã Pí Lèng'],
    schedule: [
      { time: 'Đêm 0 - 21:00', task: 'Xe cabin limousine Hà Nội - TP Hà Giang' },
      { time: 'Ngày 1 - 07:00', task: 'Nhận xe máy, vượt Cổng Trời Quản Bạ, Rừng thông Yên Minh, Phố Cáo' },
      { time: 'Ngày 2 - 06:30', task: 'Chinh phục Đèo Mã Pí Lèng, xuống bến thuyền Hẻm Tu Sản' },
      { time: 'Ngày 3 - 08:00', task: 'Tham quan Dinh Họ Vương, Cột Cờ Lũng Cú và trở về' }
    ]
  }
];

const SAFETY_ALERTS = [
  {
    type: 'warning',
    region: 'Đèo Khau Phạ & Tà Xùa',
    title: 'Sương mù dày đặc tầm nhìn dưới 5m sáng sớm',
    advice: 'Bật đèn sương mù vàng, giữ khoảng cách tối thiểu 20m, không vượt ẩu trên cua tay áo.'
  },
  {
    type: 'info',
    region: 'Đèo Mã Pí Lèng',
    title: 'Nhiệt độ ban đêm hạ xuống 11°C',
    advice: 'Chuẩn bị áo gió chống nước 2 lớp, găng tay giữ ấm khi đổ đèo.'
  }
];

export const itineraryService = {
  async getCuratedItineraries() {
    return CURATED_ITINERARIES;
  },

  async getSafetyAlerts() {
    return SAFETY_ALERTS;
  }
};

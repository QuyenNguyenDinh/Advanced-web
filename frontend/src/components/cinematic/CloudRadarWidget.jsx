import React, { useState, useEffect } from 'react';
import { weatherCloudService } from '../../services/weather-cloud.service';
import { FaCloudSun, FaWind, FaTemperatureLow, FaCompass, FaEye, FaMountain, FaBolt } from 'react-icons/fa';

export default function CloudRadarWidget() {
  const [telemetryList, setTelemetryList] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch from microservice
    weatherCloudService.getAllSpotTelemetry().then((data) => {
      setTelemetryList(data);
      if (data.length > 0) setSelectedSpot(data[0]);
      setLoading(false);
    });

    // Subscribe to live simulated microservice radar stream
    const unsubscribe = weatherCloudService.subscribeRadarUpdates((updatedList) => {
      setTelemetryList(updatedList);
      setSelectedSpot((prev) => {
        if (!prev) return updatedList[0];
        return updatedList.find((s) => s.id === prev.id) || prev;
      });
    });

    return () => unsubscribe();
  }, []);

  if (loading || !selectedSpot) {
    return (
      <div className="p-4 text-center text-light opacity-50">
        <span className="spinner-border spinner-border-sm me-2" />
        Đang đồng bộ dữ liệu vi khí hậu...
      </div>
    );
  }

  return (
    <div
      className="cloud-radar-container"
      style={{
        background: 'rgba(8, 14, 24, 0.72)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
        color: '#e2e8f0',
        maxWidth: '1000px',
        margin: '0 auto'
      }}
    >
      {/* Header bar */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 pb-3 mb-4 border-bottom border-secondary border-opacity-25">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                boxShadow: '0 0 10px #10b981'
              }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                letterSpacing: '0.15em',
                color: '#10b981',
                textTransform: 'uppercase',
                fontWeight: 600
              }}
            >
              RADAR KHÍ TƯỢNG LIVE • TÂY BẮC
            </span>
          </div>
          <h3
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '1.6rem',
              fontWeight: 700,
              color: '#ffffff',
              margin: 0
            }}
          >
            Chỉ Số Xác Suất Biển Mây Thời Gian Thực
          </h3>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-warning bg-opacity-20 text-warning px-3 py-2 rounded-pill font-monospace small">
            <FaBolt className="me-1" /> Microservice Telemetry
          </span>
        </div>
      </div>

      {/* Spot Selector Tabs */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {telemetryList.map((spot) => {
          const isSelected = selectedSpot.id === spot.id;
          return (
            <button
              key={spot.id}
              onClick={() => setSelectedSpot(spot)}
              style={{
                background: isSelected ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                border: isSelected ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
                color: isSelected ? '#f59e0b' : '#94a3b8',
                padding: '8px 18px',
                borderRadius: '50px',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <FaMountain style={{ fontSize: '11px' }} />
              {spot.name.split(' (')[0]}
              <span
                style={{
                  background: isSelected ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)',
                  color: isSelected ? '#000' : '#e2e8f0',
                  padding: '2px 7px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: 700
                }}
              >
                {spot.cloudProbability}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Telemetry Focus Grid */}
      <div className="row g-4 align-items-center">
        {/* Left: Giant Probability Gauge */}
        <div className="col-12 col-md-5 text-center text-md-start">
          <div
            style={{
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01))',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '28px'
            }}
          >
            <div className="text-secondary small font-monospace mb-1">KHẢ NĂNG XUẤT HIỆN BIỂN MÂY</div>
            <div
              style={{
                fontFamily: "'Space Grotesk', 'Syne', sans-serif",
                fontSize: '4.2rem',
                fontWeight: 800,
                lineHeight: 1,
                color: selectedSpot.cloudProbability >= 85 ? '#10b981' : '#f59e0b',
                textShadow: '0 0 30px rgba(16, 185, 129, 0.4)'
              }}
            >
              {selectedSpot.cloudProbability}
              <span style={{ fontSize: '2rem', fontWeight: 600, opacity: 0.7 }}>%</span>
            </div>

            <div className="mt-3">
              <span
                className={`badge ${
                  selectedSpot.cloudProbability >= 85 ? 'bg-success' : 'bg-warning'
                } bg-opacity-25 text-white px-3 py-2 rounded-pill fw-semibold`}
                style={{ fontSize: '13px' }}
              >
                ● {selectedSpot.status}
              </span>
            </div>

            <p className="mt-3 small text-secondary mb-0" style={{ lineHeight: 1.6 }}>
              {selectedSpot.conditions}
            </p>
          </div>
        </div>

        {/* Right: Key Meteorological Gauges */}
        <div className="col-12 col-md-7">
          <div className="row g-3">
            <div className="col-6">
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '16px',
                  padding: '16px 20px'
                }}
              >
                <div className="d-flex align-items-center gap-2 text-warning mb-1">
                  <FaTemperatureLow />
                  <span className="small text-secondary font-monospace">NHIỆT ĐỘ ĐỈNH</span>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>
                  {selectedSpot.temperature}
                </div>
                <div className="small text-muted font-monospace">Độ ẩm: {selectedSpot.humidity}</div>
              </div>
            </div>

            <div className="col-6">
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '16px',
                  padding: '16px 20px'
                }}
              >
                <div className="d-flex align-items-center gap-2 text-info mb-1">
                  <FaWind />
                  <span className="small text-secondary font-monospace">TỐC ĐỘ GIÓ</span>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>
                  {selectedSpot.windSpeed}
                </div>
                <div className="small text-muted font-monospace">Gió đèo ổn định</div>
              </div>
            </div>

            <div className="col-6">
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '16px',
                  padding: '16px 20px'
                }}
              >
                <div className="d-flex align-items-center gap-2 text-success mb-1">
                  <FaMountain />
                  <span className="small text-secondary font-monospace">ĐỘ CAO ĐỊA HÌNH</span>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>
                  {selectedSpot.elevation}
                </div>
                <div className="small text-muted font-monospace">Tầng nghịch: {selectedSpot.inversionLayer}</div>
              </div>
            </div>

            <div className="col-6">
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '16px',
                  padding: '16px 20px'
                }}
              >
                <div className="d-flex align-items-center gap-2 text-warning mb-1">
                  <FaCloudSun />
                  <span className="small text-secondary font-monospace">GIỜ VÀNG SĂN MÂY</span>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>
                  {selectedSpot.bestWindow}
                </div>
                <div className="small text-muted font-monospace">Bình minh: {selectedSpot.sunrise}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

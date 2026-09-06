/**
 * LYTEBOX Cloud Gaming Engine - Android App Client
 * Full-featured cloud gaming client with interactive streaming engine,
 * on-screen virtual touch gamepad, telemetry HUD, server region picker,
 * and complete native Android Kotlin source code studio.
 */

import React, { useState, useCallback } from 'react';
import {
  GameTitle,
  EngineConfig,
  StreamTelemetry,
  GamepadState,
  CloudServerRegion,
} from './types';
import { GAMES_CATALOG, CLOUD_REGIONS, DEFAULT_ENGINE_CONFIG } from './data/gamesData';
import { StreamEngineCanvas } from './components/StreamEngineCanvas';
import { VirtualGamepad } from './components/VirtualGamepad';
import { TelemetryOverlay } from './components/TelemetryOverlay';
import { GameCatalog } from './components/GameCatalog';
import { EngineSettingsModal } from './components/EngineSettingsModal';
import { AndroidCodeViewer } from './components/AndroidCodeViewer';
import { AndroidDeviceFrame } from './components/AndroidDeviceFrame';
import { Zap, Radio, Loader2, CheckCircle2 } from 'lucide-react';

const INITIAL_GAMEPAD_STATE: GamepadState = {
  leftStick: { x: 0, y: 0 },
  rightStick: { x: 0, y: 0 },
  buttons: {
    a: false,
    b: false,
    x: false,
    y: false,
    l1: false,
    r1: false,
    l2: 0,
    r2: 0,
    dpadUp: false,
    dpadDown: false,
    dpadLeft: false,
    dpadRight: false,
    start: false,
    select: false,
    home: false,
    l3: false,
    r3: false,
  },
  isPhysicalConnected: false,
};

const INITIAL_TELEMETRY: StreamTelemetry = {
  fps: 120,
  rttMs: 14,
  decodeMs: 2.1,
  renderMs: 1.2,
  bitrateCurrentMbps: 45,
  jitterMs: 0.6,
  packetLossPercent: 0.0,
  networkQuality: 'OPTIMAL',
  framesDecoded: 0,
  framesDropped: 0,
  codecInUse: 'AV1',
};

export default function App() {
  const [games] = useState<GameTitle[]>(GAMES_CATALOG);
  const [regions] = useState<CloudServerRegion[]>(CLOUD_REGIONS);
  const [config, setConfig] = useState<EngineConfig>(DEFAULT_ENGINE_CONFIG);
  const [selectedGame, setSelectedGame] = useState<GameTitle | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectStep, setConnectStep] = useState<string>('');

  // Device & UI state
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [isDeviceMockup, setIsDeviceMockup] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCodeViewerOpen, setIsCodeViewerOpen] = useState(false);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);

  // Runtime Gamepad & Telemetry states
  const [gamepadState, setGamepadState] = useState<GamepadState>(INITIAL_GAMEPAD_STATE);
  const [telemetry, setTelemetry] = useState<StreamTelemetry>(INITIAL_TELEMETRY);

  // Handle game launch with authentic cloud session handshake
  const handleLaunchGame = useCallback((game: GameTitle) => {
    setIsConnecting(true);
    setConnectStep('Allocating Cloud GPU Instance (NVIDIA RTX 4090)...');

    setTimeout(() => {
      setConnectStep('Establishing Ultra-Low Latency WebRTC / QUIC Pipeline...');
    }, 450);

    setTimeout(() => {
      setConnectStep('Hardware MediaCodec AV1 Zero-Copy Handshake...');
    }, 900);

    setTimeout(() => {
      setIsConnecting(false);
      setSelectedGame(game);
      setOrientation('landscape'); // Switch to landscape for immersive gaming
    }, 1300);
  }, []);

  // Exit streaming session
  const handleExitSession = useCallback(() => {
    setSelectedGame(null);
    setOrientation('portrait');
  }, []);

  // Update engine configuration
  const handleUpdateConfig = useCallback((newConfig: Partial<EngineConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  // Update telemetry
  const handleUpdateTelemetry = useCallback((newTelemetry: StreamTelemetry) => {
    setTelemetry(newTelemetry);
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#050505] text-[#EAEAEA] font-sans selection:bg-indigo-600 selection:text-white">
      <AndroidDeviceFrame
        orientation={orientation}
        isDeviceMockup={isDeviceMockup}
        onToggleOrientation={() =>
          setOrientation((prev) => (prev === 'portrait' ? 'landscape' : 'portrait'))
        }
        onToggleMockup={() => setIsDeviceMockup((prev) => !prev)}
        onBackToHome={handleExitSession}
      >
        {/* Main View Router: Stream Engine Session vs Game Catalog */}
        {selectedGame ? (
          <div className="relative w-full h-full bg-[#050505] flex items-center justify-center overflow-hidden">
            {/* Real-time interactive Cloud Gaming Canvas */}
            <StreamEngineCanvas
              game={selectedGame}
              config={config}
              gamepadState={gamepadState}
              onUpdateTelemetry={handleUpdateTelemetry}
              onExitSession={handleExitSession}
            />

            {/* Diagnostic Stream Telemetry Overlay HUD */}
            <TelemetryOverlay
              telemetry={telemetry}
              config={config}
              isOpen={isTelemetryOpen}
              onToggleOpen={() => setIsTelemetryOpen((prev) => !prev)}
            />

            {/* Android Multi-Touch Virtual Gamepad */}
            <VirtualGamepad
              gamepadState={gamepadState}
              onUpdateGamepad={setGamepadState}
              opacity={config.virtualGamepadOpacity}
              scale={config.virtualGamepadScale}
              hapticEnabled={config.hapticFeedback}
              hapticIntensity={config.hapticIntensity}
            />
          </div>
        ) : (
          <GameCatalog
            games={games}
            regions={regions}
            config={config}
            onSelectGame={handleLaunchGame}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenCodeViewer={() => setIsCodeViewerOpen(true)}
            onChangeRegion={(regId) => handleUpdateConfig({ selectedServerRegion: regId })}
          />
        )}

        {/* Cloud Session Handshake Connecting Modal */}
        {isConnecting && (
          <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 z-50 text-center space-y-5">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl">
                <Radio className="w-7 h-7 text-indigo-400 animate-pulse" />
              </div>
            </div>

            <div>
              <div
                className="text-xl md:text-2xl font-light tracking-widest text-[#EAEAEA] uppercase"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                Initializing Stream
              </div>
              <div className="text-xs font-mono text-white/50 mt-2 flex items-center justify-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                <span>{connectStep}</span>
              </div>
            </div>

            <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="w-full h-full bg-indigo-400 animate-[pulse_1s_infinite]" />
            </div>
          </div>
        )}

        {/* Engine Settings Modal */}
        {isSettingsOpen && (
          <EngineSettingsModal
            config={config}
            regions={regions}
            onUpdateConfig={handleUpdateConfig}
            onClose={() => setIsSettingsOpen(false)}
          />
        )}

        {/* Full Android Kotlin Code Studio & Downloader */}
        {isCodeViewerOpen && (
          <AndroidCodeViewer onClose={() => setIsCodeViewerOpen(false)} />
        )}
      </AndroidDeviceFrame>
    </div>
  );
}

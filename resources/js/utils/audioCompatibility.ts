/**
 * Audio compatibility and permission utilities for WebRTC
 */

export interface AudioCompatibilityCheck {
    isSupported: boolean;
    hasPermissions: boolean;
    hasMicrophone: boolean;
    errors: string[];
}

/**
 * Check if WebRTC audio is supported in the current browser
 */
export function checkWebRTCAudioSupport(): AudioCompatibilityCheck {
    const result: AudioCompatibilityCheck = {
        isSupported: false,
        hasPermissions: false,
        hasMicrophone: false,
        errors: []
    };

    // Check for basic WebRTC support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        result.errors.push('WebRTC is not supported in this browser');
        return result;
    }

    // Check for RTCPeerConnection support
    if (!window.RTCPeerConnection) {
        result.errors.push('RTCPeerConnection is not supported');
        return result;
    }

    result.isSupported = true;

    // Check for microphone access
    if (!navigator.mediaDevices.enumerateDevices) {
        result.errors.push('Cannot enumerate media devices');
        return result;
    }

    return result;
}

/**
 * Request audio permissions and check microphone availability
 */
export async function requestAudioPermissions(): Promise<AudioCompatibilityCheck> {
    const result = checkWebRTCAudioSupport();

    if (!result.isSupported) {
        return result;
    }

    try {
        // Check available devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(device => device.kind === 'audioinput');

        if (audioInputs.length === 0) {
            result.errors.push('No microphone found');
            return result;
        }

        result.hasMicrophone = true;

        // Request permission by attempting to get user media
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            }
        });

        // Stop the stream immediately after getting permission
        stream.getTracks().forEach(track => track.stop());

        result.hasPermissions = true;
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'NotAllowedError') {
                result.errors.push('Microphone permission denied');
            } else if (error.name === 'NotFoundError') {
                result.errors.push('No microphone found');
            } else if (error.name === 'NotReadableError') {
                result.errors.push('Microphone is already in use');
            } else {
                result.errors.push(`Audio permission error: ${error.message}`);
            }
        } else {
            result.errors.push('Unknown audio permission error');
        }
    }

    return result;
}

/**
 * Check if the browser supports the required audio features
 */
export function getBrowserAudioSupport(): { supported: boolean; features: string[] } {
    const features: string[] = [];

    if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
        features.push('getUserMedia');
    }

    if (typeof window.RTCPeerConnection === 'function') {
        features.push('RTCPeerConnection');
    }

    if (typeof window.RTCDataChannel === 'function') {
        features.push('RTCDataChannel');
    }

    // Check for modern audio constraints support
    try {
        const audioConstraints = {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
        };
        features.push('AudioConstraints');
    } catch (e) {
        // Constraints not supported
    }

    return {
        supported: features.length >= 2, // At minimum need getUserMedia and RTCPeerConnection
        features
    };
}

/**
 * Get user-friendly error message for audio issues
 */
export function getAudioErrorMessage(error: string): string {
    const errorMessages: Record<string, string> = {
        'WebRTC is not supported in this browser': 'Your browser does not support audio calls. Please use a modern browser like Chrome, Firefox, or Safari.',
        'RTCPeerConnection is not supported': 'Your browser version is too old for audio calls. Please update your browser.',
        'No microphone found': 'No microphone detected. Please connect a microphone and refresh the page.',
        'Microphone permission denied': 'Microphone access denied. Please allow microphone access in your browser settings.',
        'Microphone is already in use': 'Your microphone is being used by another application. Please close other apps using the microphone.',
        'Cannot enumerate media devices': 'Cannot access media devices. Please check your browser permissions.'
    };

    return errorMessages[error] || 'An audio error occurred. Please check your microphone and browser settings.';
}
# Sign Language Identifier - Usage Guide

## Quick Start

### 1. Installation
```bash
npm install
```

### 2. Development Mode
```bash
npm run dev
```
Then open http://localhost:3000 in your browser.

### 3. Production Build
```bash
npm run build
npm start
```

## Features Overview

### Real-Time Hand Detection
- Uses MediaPipe Hands AI model for accurate hand tracking
- Detects up to 2 hands simultaneously
- Tracks 21 landmark points per hand
- Works in real-time with webcam feed

### Gesture Recognition
The system recognizes:
- **ASL Alphabet**: A, B, C, D, E, F, G, H, I, L, O, V, Y
- **Numbers**: 1, 2, 3, 4, 5
- **Common Gestures**: Thumbs Up (👍), Peace Sign (✌️)

### Text Output
- Real-time conversion of gestures to text
- Confidence scores for each detection
- Text-to-speech functionality
- Clear and reset options

### History Tracking
- Logs all detected gestures
- Shows confidence scores
- Displays timestamps
- Visual confidence indicators

## How to Use

### Step 1: Grant Camera Access
When you first open the application, your browser will ask for camera permissions. Click "Allow" to enable hand detection.

### Step 2: Position Your Hand
- Place your hand in front of the camera
- Ensure good lighting
- Keep your hand within the camera frame
- Position hand 1-2 feet from camera for best results

### Step 3: Make Gestures
- Form clear, distinct hand shapes
- Hold each gesture steady for about 1 second
- The system needs consistent detection before adding to text
- Watch the live feedback showing current gesture

### Step 4: View Results
- Recognized text appears in the "Recognized Text" panel
- Click "Speak" to hear the text read aloud
- Click "Clear" to reset the text
- View history of all detected gestures below

## Supported Gestures Guide

### Letters
- **A**: Closed fist with thumb to the side
- **B**: All fingers extended upward, thumb tucked
- **C**: Curved hand forming C shape
- **D**: Index finger up, thumb touching middle finger
- **E**: All fingers curled into palm
- **F**: Index and thumb forming circle, other fingers up
- **G**: Index finger pointing sideways, thumb extended
- **H**: Index and middle fingers extended sideways together
- **I**: Pinky finger extended upward
- **L**: Index finger up, thumb out at 90° angle
- **O**: All fingers forming circle with thumb
- **V**: Index and middle fingers in V shape
- **Y**: Thumb and pinky extended

### Numbers
- **1**: Index finger extended
- **2**: Index and middle fingers extended
- **3**: Index, middle, and ring fingers extended
- **4**: All fingers except thumb extended
- **5**: All five fingers spread open

### Common Gestures
- **Thumbs Up (👍)**: Thumb extended upward, other fingers closed
- **Peace Sign (✌️)**: Index and middle fingers in V, thumb tucked

## Tips for Best Results

### Lighting
- Use bright, even lighting
- Avoid backlighting (light behind you)
- Natural daylight works best
- Avoid harsh shadows on your hand

### Hand Position
- Keep hand centered in frame
- Maintain 1-2 feet distance from camera
- Face palm toward camera for most gestures
- Keep hand steady while signing

### Gesture Clarity
- Make distinct, clear hand shapes
- Hold each gesture for 1-2 seconds
- Avoid rapid movements
- Practice gestures for better recognition

### Camera Setup
- Use a stable camera position
- Ensure camera is at eye level or slightly above
- Clean camera lens for clear image
- Use a high-quality webcam if possible

## Troubleshooting

### Camera Not Working
- Check browser permissions (Settings → Privacy → Camera)
- Ensure no other application is using the camera
- Try refreshing the page
- Use a supported browser (Chrome, Firefox, Safari, Edge)

### Poor Detection Accuracy
- Improve lighting conditions
- Move closer or farther from camera
- Make more distinct hand shapes
- Ensure hand is fully visible in frame
- Clean camera lens

### Slow Performance
- Close other browser tabs
- Ensure good internet connection (for loading AI models)
- Use a modern computer with good CPU/GPU
- Try reducing browser zoom level

### No Text Appearing
- Hold gestures longer (1-2 seconds)
- Make clearer hand shapes
- Check that hand is detected (green landmarks visible)
- Ensure gesture is in supported list

## Browser Compatibility

### Fully Supported
- ✅ Google Chrome 90+
- ✅ Microsoft Edge 90+
- ✅ Mozilla Firefox 88+
- ✅ Safari 14.3+ (macOS/iOS)
- ✅ Opera 76+

### Requirements
- WebRTC support for camera access
- WebGL support for AI model
- JavaScript enabled
- Modern browser (released within last 2 years)

## Privacy & Security

### Data Handling
- ✅ All processing happens locally in your browser
- ✅ No video or images sent to external servers
- ✅ No data stored or transmitted
- ✅ Camera access only used for real-time detection
- ✅ No cookies or tracking

### Permissions
- Camera access required for hand detection
- Microphone NOT required
- Location NOT required
- No account or login needed

## Performance Optimization

### For Best Performance
1. Use Chrome or Edge browser (best WebGL support)
2. Close unnecessary browser tabs
3. Ensure good CPU/GPU performance
4. Use wired internet connection
5. Keep browser updated

### Adjusting Settings
You can modify detection sensitivity in the code:
- Edit `components/WebcamCapture.tsx`
- Adjust `minDetectionConfidence` (default: 0.7)
- Adjust `minTrackingConfidence` (default: 0.7)
- Lower values = more sensitive but less accurate
- Higher values = less sensitive but more accurate

## Accessibility Features

### Built-in Accessibility
- High contrast text and UI
- Large, clear typography
- Keyboard navigation support
- Screen reader compatible
- Text-to-speech functionality
- Responsive design for all devices

### For Users with Disabilities
- Visual feedback for all actions
- Audio feedback via text-to-speech
- Clear error messages
- Simple, intuitive interface
- No time-sensitive interactions

## Advanced Usage

### Adding Custom Gestures
1. Open `utils/gestureRecognition.ts`
2. Add new recognition logic in `recognizeGesture` method
3. Define landmark conditions for your gesture
4. Return gesture name and confidence score

Example:
```typescript
// Custom gesture: Rock sign
if (indexExtended && pinkyExtended && !middleExtended && !ringExtended) {
  return { gesture: "🤘 Rock", confidence: 0.85 };
}
```

### Adjusting Detection Speed
In `components/WebcamCapture.tsx`, modify:
```typescript
if (gestureCountRef.current >= 10) { // Change this number
  // Lower = faster but less stable
  // Higher = slower but more stable
}
```

### Customizing UI
- Edit `app/page.tsx` for layout changes
- Modify `app/globals.css` for styling
- Update Tailwind classes for colors/spacing
- Add new components in `components/` folder

## API Reference

### GestureResult Interface
```typescript
interface GestureResult {
  gesture: string;      // Recognized gesture name
  confidence: number;   // Confidence score (0-1)
  timestamp: Date;      // When gesture was detected
}
```

### HandLandmark Interface
```typescript
interface HandLandmark {
  x: number;  // X coordinate (0-1)
  y: number;  // Y coordinate (0-1)
  z: number;  // Z depth (relative)
}
```

## Support & Resources

### Getting Help
- Check this guide first
- Review README.md for technical details
- Check browser console for errors
- Ensure all dependencies installed

### Learning ASL
- Practice with ASL alphabet charts
- Watch ASL tutorial videos
- Use this app to practice recognition
- Join ASL learning communities

### Contributing
- Report bugs via GitHub issues
- Suggest new features
- Submit pull requests
- Share your improvements

## Future Enhancements

### Planned Features
- [ ] Full ASL alphabet support (all 26 letters)
- [ ] Word and phrase recognition
- [ ] Multiple language support
- [ ] Custom gesture training
- [ ] Mobile app version
- [ ] Offline mode
- [ ] Save/export text functionality
- [ ] Video recording of signs
- [ ] Practice mode with feedback

### Community Requests
We welcome suggestions for new features! Consider:
- Additional gesture sets
- Different sign languages (BSL, LSF, etc.)
- Educational modes
- Multiplayer/collaborative features
- Integration with other apps

---

## Quick Reference Card

| Gesture | Hand Shape | Confidence |
|---------|-----------|------------|
| A | Closed fist, thumb side | 85% |
| B | Fingers up, thumb tucked | 88% |
| L | Index up, thumb out | 90% |
| V | Two fingers V-shape | 88% |
| 1 | Index finger only | 90% |
| 5 | All fingers spread | 90% |
| 👍 | Thumb up | 85% |
| ✌️ | Peace sign | 86% |

---

**Built with ❤️ to make communication accessible for everyone.**

For technical support or questions, please refer to the README.md file or project documentation.

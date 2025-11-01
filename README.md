# Sign Language Identifier

An AI-powered real-time sign language recognition system that converts hand gestures to text, designed to help mute and deaf people communicate more effectively.

## Features

- **Real-time Hand Detection**: Uses MediaPipe Hands for accurate hand landmark detection
- **Gesture Recognition**: Recognizes ASL alphabet letters, numbers, and common gestures
- **Text Output**: Converts recognized signs to readable text in real-time
- **Speech Synthesis**: Text-to-speech functionality to vocalize recognized text
- **Recognition History**: Tracks all detected gestures with confidence scores
- **Responsive Design**: Works on desktop and mobile devices
- **Accessible UI**: High contrast, clear typography, and intuitive interface

## Technology Stack

- **Next.js 15**: React framework for production
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **TensorFlow.js**: Machine learning in the browser
- **MediaPipe Hands**: Hand landmark detection
- **React Webcam**: Camera access and video capture

## Supported Gestures

- ASL Alphabet: A-Z
- Numbers: 1-5
- Common gestures: Thumbs Up, Peace Sign
- More gestures can be added by extending the recognition logic

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A webcam or camera device
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

4. Allow camera permissions when prompted

### Building for Production

```bash
npm run build
npm start
```

## How It Works

1. **Camera Capture**: The application accesses your webcam using React Webcam
2. **Hand Detection**: MediaPipe Hands detects hand landmarks (21 points per hand)
3. **Gesture Recognition**: Custom algorithm analyzes landmark positions to identify gestures
4. **Text Conversion**: Recognized gestures are converted to text and displayed
5. **History Tracking**: All detections are logged with timestamps and confidence scores

## Usage Tips

- Hold your hand steady in front of the camera
- Ensure good lighting for better detection
- Position your hand clearly within the camera frame
- Hold each gesture for about 1 second for recognition
- The system requires consistent gesture detection before adding to text

## Project Structure

```
/vercel/sandbox/
├── app/
│   ├── page.tsx          # Main application page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── WebcamCapture.tsx    # Camera and hand detection
│   ├── GestureDisplay.tsx   # Text output display
│   └── HistoryPanel.tsx     # Recognition history
├── utils/
│   └── gestureRecognition.ts # Gesture recognition logic
├── types/
│   └── index.ts          # TypeScript type definitions
└── package.json
```

## Customization

### Adding New Gestures

Edit `utils/gestureRecognition.ts` and add new recognition logic in the `recognizeGesture` method:

```typescript
// Example: Add a new gesture
if (/* your condition */) {
  return { gesture: "NewGesture", confidence: 0.85 };
}
```

### Adjusting Detection Sensitivity

Modify the MediaPipe Hands options in `components/WebcamCapture.tsx`:

```typescript
hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,  // Adjust this
  minTrackingConfidence: 0.7,   // Adjust this
});
```

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 14.3+)
- Opera: Full support

## Privacy & Security

- All processing happens locally in your browser
- No video or image data is sent to external servers
- Camera access is only used for real-time detection
- No data is stored or transmitted

## Future Enhancements

- [ ] Support for full ASL alphabet
- [ ] Word and phrase recognition
- [ ] Multiple language support
- [ ] Custom gesture training
- [ ] Mobile app version
- [ ] Offline mode with service workers
- [ ] Save and export recognized text

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT License - feel free to use this project for any purpose.

## Acknowledgments

- MediaPipe team for the hand detection model
- TensorFlow.js team for browser-based ML
- ASL community for gesture references

## Support

For issues, questions, or suggestions, please open an issue on the project repository.

---

Built with ❤️ to make communication more accessible for everyone.

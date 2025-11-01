# Developer Notes - Sign Language Identifier

## Quick Start Commands

```bash
# Install dependencies
npm install

# Development server (DO NOT RUN - blocks terminal)
# npm run dev

# Production build
npm run build

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

## Architecture Overview

### Component Hierarchy
```
App (page.tsx)
├── WebcamCapture
│   ├── Webcam (react-webcam)
│   ├── Canvas (hand landmarks overlay)
│   └── MediaPipe Hands (AI model)
├── GestureDisplay
│   ├── Text output
│   └── Control buttons
└── HistoryPanel
    └── Gesture history list
```

### Data Flow
```
Webcam → MediaPipe → Landmarks → GestureRecognizer → Text Output
                                        ↓
                                    History
```

## Key Files Explained

### `/app/page.tsx`
- Main application component
- State management for text and history
- Callback handlers for gesture detection
- Layout and composition of child components

### `/components/WebcamCapture.tsx`
- Manages webcam access via react-webcam
- Initializes MediaPipe Hands model
- Processes video frames in real-time
- Draws hand landmarks on canvas
- Calls gesture recognition
- Implements gesture stability (10 frame requirement)

### `/components/GestureDisplay.tsx`
- Displays recognized text
- Clear and speak buttons
- Real-time status indicator

### `/components/HistoryPanel.tsx`
- Lists all detected gestures
- Shows confidence scores
- Displays timestamps
- Visual confidence bars

### `/utils/gestureRecognition.ts`
- Core gesture recognition algorithm
- Analyzes hand landmark positions
- Calculates angles and distances
- Returns gesture name and confidence

### `/types/index.ts`
- TypeScript type definitions
- Interfaces for gesture results and landmarks

## MediaPipe Hands Integration

### Model Configuration
```typescript
hands.setOptions({
  maxNumHands: 2,              // Detect up to 2 hands
  modelComplexity: 1,          // 0=lite, 1=full (balance)
  minDetectionConfidence: 0.7, // 70% confidence to detect
  minTrackingConfidence: 0.7,  // 70% confidence to track
});
```

### Landmark Indices
```
Thumb:  0 (wrist), 1, 2, 3, 4 (tip)
Index:  5, 6, 7, 8 (tip)
Middle: 9, 10, 11, 12 (tip)
Ring:   13, 14, 15, 16 (tip)
Pinky:  17, 18, 19, 20 (tip)
```

### Coordinate System
- X: 0 (left) to 1 (right)
- Y: 0 (top) to 1 (bottom)
- Z: Relative depth (negative = closer)

## Gesture Recognition Algorithm

### Detection Methods

#### 1. Finger Extension
```typescript
isFingerExtended(landmarks, tipIndex, pipIndex) {
  return landmarks[tipIndex].y < landmarks[pipIndex].y;
}
```

#### 2. Distance Calculation
```typescript
calculateDistance(a, b) {
  return Math.sqrt((a.x - b.x)² + (a.y - b.y)²);
}
```

#### 3. Angle Calculation
```typescript
calculateAngle(a, b, c) {
  // Returns angle at point b
  // Uses atan2 for direction
}
```

### Adding New Gestures

1. **Analyze the gesture**:
   - Which fingers are extended?
   - What's the hand orientation?
   - Any specific distances/angles?

2. **Add recognition logic**:
```typescript
// Example: Rock sign (index + pinky extended)
if (indexExtended && pinkyExtended && 
    !middleExtended && !ringExtended) {
  return { gesture: "🤘", confidence: 0.85 };
}
```

3. **Test and adjust**:
   - Try the gesture in front of camera
   - Adjust confidence threshold
   - Refine conditions for accuracy

## Performance Optimization

### Current Optimizations
- Dynamic import for WebcamCapture (SSR disabled)
- Canvas-based rendering (GPU accelerated)
- Gesture stability check (prevents flickering)
- Efficient landmark processing

### Potential Improvements
- Web Workers for gesture recognition
- OffscreenCanvas for better performance
- Model caching with service workers
- Debouncing for text updates

## Common Issues & Solutions

### Issue: Camera not initializing
**Solution**: Check browser permissions, ensure HTTPS in production

### Issue: Poor gesture detection
**Solution**: Adjust `minDetectionConfidence` and `minTrackingConfidence`

### Issue: Text updates too fast
**Solution**: Increase `gestureCountRef` threshold (currently 10)

### Issue: Build errors
**Solution**: Ensure all dependencies installed, check TypeScript errors

## Testing Strategy

### Manual Testing Checklist
- [ ] Camera access granted
- [ ] Video feed displays correctly
- [ ] Hand landmarks appear when hand visible
- [ ] Gestures recognized accurately
- [ ] Text updates correctly
- [ ] Speak button works
- [ ] Clear button works
- [ ] History updates
- [ ] Responsive on mobile
- [ ] Works in different browsers

### Browser Testing
```bash
# Build first
npm run build

# Then test in:
- Chrome/Edge (best support)
- Firefox
- Safari (macOS/iOS)
```

## Debugging Tips

### Enable Console Logging
Add to `WebcamCapture.tsx`:
```typescript
console.log('Landmarks:', landmarks);
console.log('Gesture:', gesture, 'Confidence:', confidence);
```

### Visualize Detection
The canvas already shows:
- Green lines: Hand connections
- Red dots: Landmark points
- Bottom overlay: Current gesture

### Check MediaPipe Loading
```typescript
console.log('MediaPipe loaded:', hands);
```

## Code Style Guidelines

### TypeScript
- Use interfaces for data structures
- Avoid `any` type
- Enable strict mode
- Use proper type annotations

### React
- Use functional components
- Prefer hooks over classes
- Use `useCallback` for handlers
- Use `useRef` for mutable values

### Naming Conventions
- Components: PascalCase
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE
- Files: PascalCase for components, camelCase for utils

## Environment Variables

Currently none required. All processing is client-side.

For future API integration:
```env
NEXT_PUBLIC_API_URL=https://api.example.com
```

## Deployment Considerations

### Vercel (Recommended)
```bash
vercel
```

### Environment Requirements
- Node.js 18+
- HTTPS (required for camera access)
- Modern browser support

### Build Output
- Static pages: 4
- First Load JS: ~105 KB
- Optimized for production

## Future Development Roadmap

### Phase 1: Enhanced Recognition
- [ ] Complete ASL alphabet (26 letters)
- [ ] More numbers (6-10)
- [ ] Common words/phrases

### Phase 2: Advanced Features
- [ ] Custom gesture training
- [ ] Multiple sign languages
- [ ] Gesture recording/playback
- [ ] Practice mode with feedback

### Phase 3: Platform Expansion
- [ ] Mobile app (React Native)
- [ ] Offline mode (PWA)
- [ ] Desktop app (Electron)
- [ ] Browser extension

### Phase 4: AI Improvements
- [ ] Deep learning model training
- [ ] Continuous gesture recognition
- [ ] Context-aware predictions
- [ ] Multi-hand phrase detection

## Contributing Guidelines

### Before Submitting PR
1. Run type checking: `npx tsc --noEmit`
2. Run linting: `npm run lint`
3. Test build: `npm run build`
4. Test in multiple browsers
5. Update documentation

### Code Review Checklist
- [ ] TypeScript types correct
- [ ] No console.log in production code
- [ ] Comments for complex logic
- [ ] Responsive design maintained
- [ ] Accessibility preserved
- [ ] Performance not degraded

## Useful Resources

### MediaPipe Documentation
- https://google.github.io/mediapipe/solutions/hands

### ASL References
- https://www.lifeprint.com/asl101/fingerspelling/
- ASL alphabet charts and videos

### Next.js Documentation
- https://nextjs.org/docs

### TensorFlow.js
- https://www.tensorflow.org/js

## Contact & Support

For technical questions:
1. Check this documentation
2. Review code comments
3. Test in isolation
4. Check browser console

## License

MIT License - See LICENSE file for details

---

**Last Updated**: November 1, 2025
**Version**: 1.0.0
**Status**: Production Ready ✅

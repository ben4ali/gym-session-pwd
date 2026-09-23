import { Exercise } from '../types/gym';

export const EXERCISE_DATABASE: Exercise[] = [
  // ==========================================
  // CHEST (12 exercises)
  // ==========================================
  {
    id: 'barbell-bench-press',
    name: 'Barbell Bench Press',
    category: 'Chest',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'front-deltoids'],
    equipment: 'Barbell',
    instructions: [
      'Lie flat on the bench. Grip the bar slightly wider than shoulder width.',
      'Unrack the bar and bring it steadily down to your lower sternum.',
      'Drive your feet into the floor and press straight up to lockout.'
    ],
    defaultSets: 4,
    defaultReps: 8,
    defaultRestSeconds: 90
  },
  {
    id: 'incline-barbell-bench-press',
    name: 'Incline Barbell Bench Press',
    category: 'Chest',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['front-deltoids', 'triceps'],
    equipment: 'Barbell',
    instructions: [
      'Position an incline bench at roughly 30 degrees.',
      'Lower the barbell with control to the upper chest collarbone line.',
      'Press upward toward the ceiling without flaring your elbows wide.'
    ],
    defaultSets: 4,
    defaultReps: 8,
    defaultRestSeconds: 90
  },
  {
    id: 'flat-dumbbell-press',
    name: 'Flat Dumbbell Press',
    category: 'Chest',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'front-deltoids'],
    equipment: 'Dumbbell',
    instructions: [
      'Lie back with dumbbells resting at chest level.',
      'Press dumbbells up in a natural arch over your chest.',
      'Lower under steady control until you feel a gentle chest stretch.'
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 75
  },
  {
    id: 'incline-dumbbell-press',
    name: 'Incline Dumbbell Press',
    category: 'Chest',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['front-deltoids', 'triceps'],
    equipment: 'Dumbbell',
    instructions: [
      'Set an incline bench to 30 to 45 degrees.',
      'Kick dumbbells to shoulder height and plant your feet firmly.',
      'Press upward while keeping your shoulder blades pinched and stable.'
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 75
  },
  {
    id: 'decline-dumbbell-press',
    name: 'Decline Dumbbell Press',
    category: 'Chest',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps'],
    equipment: 'Dumbbell',
    instructions: [
      'Secure your legs on a decline bench and hold dumbbells at chest level.',
      'Press directly upward above your lower chest.',
      'Lower slowly until elbows reach bench height.'
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 75
  },
  {
    id: 'standing-cable-fly',
    name: 'Standing Cable Fly',
    category: 'Chest',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['front-deltoids'],
    equipment: 'Cable',
    instructions: [
      'Set cable pulleys at chest height. Take handles and step forward.',
      'Maintain a slight elbow bend and bring hands together in front.',
      'Squeeze the pectorals for a second before controlling the stretch.'
    ],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60
  },
  {
    id: 'low-to-high-cable-fly',
    name: 'Low to High Cable Fly',
    category: 'Chest',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['front-deltoids'],
    equipment: 'Cable',
    instructions: [
      'Set pulleys at the lowest pin setting.',
      'Bring handles upward and inward towards eye level in a sweeping scoop.',
      'Contract the clavicular upper chest at the peak.'
    ],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60
  },
  {
    id: 'chest-dips',
    name: 'Chest Dips',
    category: 'Chest',
    primaryMuscles: ['chest', 'triceps'],
    secondaryMuscles: ['front-deltoids'],
    equipment: 'Bodyweight',
    instructions: [
      'Mount dip bars and angle your torso forward roughly 30 degrees.',
      'Lower yourself until elbows are bent 90 degrees.',
      'Drive straight upward through your palms to lockout.'
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 90
  },
  {
    id: 'pec-deck-machine',
    name: 'Pec Deck Machine Fly',
    category: 'Chest',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['front-deltoids'],
    equipment: 'Machine',
    instructions: [
      'Adjust seat so handles align with mid-chest.',
      'Pull levers together in front of your chest with chest lifted.',
      'Hold contraction briefly and return with controlled tempo.'
    ],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60
  },
  {
    id: 'machine-chest-press',
    name: 'Seated Machine Chest Press',
    category: 'Chest',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'front-deltoids'],
    equipment: 'Machine',
    instructions: [
      'Sit firmly with back against pad and grip handles at nipple line.',
      'Push handles outward until arms are extended.',
      'Return weight steadily without letting weight stack slam.'
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 75
  },
  {
    id: 'push-ups',
    name: 'Standard Push-ups',
    category: 'Chest',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'front-deltoids', 'abs'],
    equipment: 'Bodyweight',
    instructions: [
      'Place hands on floor slightly outside shoulder width.',
      'Keep your core tight and body in a rigid plank line.',
      'Lower chest to one inch from the ground, then press back up.'
    ],
    defaultSets: 3,
    defaultReps: 15,
    defaultRestSeconds: 60
  },
  {
    id: 'dumbbell-pullover',
    name: 'Dumbbell Pullover',
    category: 'Chest',
    primaryMuscles: ['chest', 'upper-back'],
    secondaryMuscles: ['triceps'],
    equipment: 'Dumbbell',
    instructions: [
      'Lie perpendicular across a flat bench with upper back supported.',
      'Hold a single dumbbell with both hands extended above your chest.',
      'Lower the weight back behind your head in an arc until you feel a deep stretch, then pull back up.'
    ],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 75
  },

  // ==========================================
  // BACK (13 exercises)
  // ==========================================
  {
    id: 'barbell-deadlift',
    name: 'Conventional Barbell Deadlift',
    category: 'Back',
    primaryMuscles: ['lower-back', 'hamstring', 'gluteal'],
    secondaryMuscles: ['upper-back', 'trapezius', 'forearm', 'quadriceps'],
    equipment: 'Barbell',
    instructions: [
      'Stand with feet hip width apart, bar over mid-foot.',
      'Hinge at hips, grip the bar, and flatten your back.',
      'Push the floor away with your legs and lock out your hips at the top.'
    ],
    defaultSets: 4,
    defaultReps: 5,
    defaultRestSeconds: 120
  },
  {
    id: 'barbell-bent-over-row',
    name: 'Barbell Bent-Over Row',
    category: 'Back',
    primaryMuscles: ['upper-back', 'trapezius'],
    secondaryMuscles: ['biceps', 'lower-back', 'forearm'],
    equipment: 'Barbell',
    instructions: [
      'Hinge torso to roughly 45 degrees with knees slightly bent.',
      'Pull barbell straight up into your lower belly button line.',
      'Pinch your shoulder blades and lower smoothly.'
    ],
    defaultSets: 4,
    defaultReps: 8,
    defaultRestSeconds: 90
  },
  {
    id: 'pendlay-row',
    name: 'Pendlay Row',
    category: 'Back',
    primaryMuscles: ['upper-back', 'trapezius'],
    secondaryMuscles: ['lower-back', 'biceps', 'forearm'],
    equipment: 'Barbell',
    instructions: [
      'Keep torso strictly parallel to the floor.',
      'Explosively pull bar from the floor to lower sternum.',
      'Return the bar completely to dead stop on the floor each rep.'
    ],
    defaultSets: 4,
    defaultReps: 6,
    defaultRestSeconds: 90
  },
  {
    id: 'pull-ups',
    name: 'Wide Grip Pull-ups',
    category: 'Back',
    primaryMuscles: ['upper-back'],
    secondaryMuscles: ['biceps', 'trapezius', 'forearm'],
    equipment: 'Bodyweight',
    instructions: [
      'Hang from bar with palms facing away wider than shoulder width.',
      'Pull your elbows down toward your back pockets until chin clears bar.',
      'Lower smoothly to a full dead hang.'
    ],
    defaultSets: 3,
    defaultReps: 8,
    defaultRestSeconds: 90
  },
  {
    id: 'chin-ups',
    name: 'Chin-ups (Underhand)',
    category: 'Back',
    primaryMuscles: ['upper-back', 'biceps'],
    secondaryMuscles: ['forearm'],
    equipment: 'Bodyweight',
    instructions: [
      'Grip the bar with palms facing your face, shoulder width apart.',
      'Pull yourself upward until chin clears the bar, flexing biceps and lats.',
      'Lower with control to full extension.'
    ],
    defaultSets: 3,
    defaultReps: 8,
    defaultRestSeconds: 90
  },
  {
    id: 'lat-pulldown',
    name: 'Wide Lat Pulldown',
    category: 'Back',
    primaryMuscles: ['upper-back'],
    secondaryMuscles: ['biceps', 'trapezius'],
    equipment: 'Cable',
    instructions: [
      'Sit securely with thigh pads locked. Grip bar wide.',
      'Pull bar down to upper chest while leaning back very slightly.',
      'Release weight slowly to full vertical stretch.'
    ],
    defaultSets: 4,
    defaultReps: 10,
    defaultRestSeconds: 75
  },
  {
    id: 'close-grip-pulldown',
    name: 'Close-Grip V-Bar Pulldown',
    category: 'Back',
    primaryMuscles: ['upper-back'],
    secondaryMuscles: ['biceps', 'trapezius'],
    equipment: 'Cable',
    instructions: [
      'Attach a V-bar handle to pulldown cable.',
      'Pull handle directly to chest, driving elbows down and back.',
      'Control the eccentric return until lats are fully lengthened.'
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 75
  },
  {
    id: 'seated-cable-row',
    name: 'Seated Cable Row',
    category: 'Back',
    primaryMuscles: ['upper-back'],
    secondaryMuscles: ['biceps', 'trapezius', 'lower-back'],
    equipment: 'Cable',
    instructions: [
      'Sit upright with feet on footplates and knees softly bent.',
      'Pull handle to lower ribs while keeping spine neutral and chest proud.',
      'Extend arms forward smoothly to stretch back muscles.'
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 60
  },
  {
    id: 'single-arm-dumbbell-row',
    name: 'Single-Arm Dumbbell Row',
    category: 'Back',
    primaryMuscles: ['upper-back'],
    secondaryMuscles: ['biceps', 'trapezius', 'forearm'],
    equipment: 'Dumbbell',
    instructions: [
      'Support knee and hand on flat bench with torso horizontal.',
      'Row dumbbell upward toward hip, pulling with elbow.',
      'Lower under full control without twisting torso.'
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 60
  },
  {
    id: 't-bar-row',
    name: 'T-Bar Row',
    category: 'Back',
    primaryMuscles: ['upper-back', 'trapezius'],
    secondaryMuscles: ['biceps', 'lower-back'],
    equipment: 'Machine',
    instructions: [
      'Straddle bar, hinge at hips, and take handles with neutral grip.',
      'Pull weight into abdomen, driving elbows behind your torso.',
      'Lower with control while keeping lower back firmly braced.'
    ],
    defaultSets: 4,
    defaultReps: 8,
    defaultRestSeconds: 90
  },
  {
    id: 'straight-arm-pulldown',
    name: 'Straight-Arm Cable Pulldown',
    category: 'Back',
    primaryMuscles: ['upper-back'],
    secondaryMuscles: ['triceps'],
    equipment: 'Cable',
    instructions: [
      'Stand facing high pulley with straight bar. Keep arms extended with slight elbow bend.',
      'Sweep bar downward in an arc to your thighs using lats only.',
      'Control return to eye level.'
    ],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60
  },
  {
    id: 'hyperextensions',
    name: 'Back Hyperextensions',
    category: 'Back',
    primaryMuscles: ['lower-back'],
    secondaryMuscles: ['gluteal', 'hamstring'],
    equipment: 'Bodyweight',
    instructions: [
      'Position hips on pad of 45 degree Roman chair.',
      'Lower upper body toward floor, then raise torso until inline with legs.',
      'Pause for a second at top without hyperextending neck.'
    ],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60
  },
  {
    id: 'barbell-shrug',
    name: 'Barbell Shrug',
    category: 'Back',
    primaryMuscles: ['trapezius'],
    secondaryMuscles: ['forearm'],
    equipment: 'Barbell',
    instructions: [
      'Hold a barbell at thighs with overhand grip.',
      'Elevate shoulders straight up towards your ears.',
      'Hold peak contraction for one second, then lower smoothly.'
    ],
    defaultSets: 4,
    defaultReps: 12,
    defaultRestSeconds: 60
  },

  // ==========================================
  // SHOULDERS (11 exercises)
  // ==========================================
  {
    id: 'overhead-barbell-press',
    name: 'Overhead Barbell Press',
    category: 'Shoulders',
    primaryMuscles: ['front-deltoids'],
    secondaryMuscles: ['triceps', 'trapezius', 'upper-back'],
    equipment: 'Barbell',
    instructions: [
      'Stand tall with bar racked across clavicle and front shoulders.',
      'Brace core and press bar in a straight vertical line overhead.',
      'Lock out overhead with bar centered above shoulders.'
    ],
    defaultSets: 4,
    defaultReps: 6,
    defaultRestSeconds: 90
  },
  {
    id: 'seated-dumbbell-shoulder-press',
    name: 'Seated Dumbbell Shoulder Press',
    category: 'Shoulders',
    primaryMuscles: ['front-deltoids'],
    secondaryMuscles: ['triceps', 'trapezius'],
    equipment: 'Dumbbell',
    instructions: [
      'Sit on an upright bench with dumbbells at ear height.',
      'Press both weights overhead until arms are extended.',
      'Lower slowly along the same path back to ear height.'
    ],
    defaultSets: 4,
    defaultReps: 8,
    defaultRestSeconds: 75
  },
  {
    id: 'arnold-press',
    name: 'Arnold Dumbbell Press',
    category: 'Shoulders',
    primaryMuscles: ['front-deltoids'],
    secondaryMuscles: ['triceps', 'trapezius'],
    equipment: 'Dumbbell',
    instructions: [
      'Start with dumbbells held at chin height, palms facing you.',
      'As you press upward, rotate palms outward so they face forward at the top.',
      'Reverse the rotational movement as you lower the weights.'
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 75
  },
  {
    id: 'dumbbell-lateral-raise',
    name: 'Dumbbell Lateral Raise',
    category: 'Shoulders',
    primaryMuscles: ['front-deltoids'],
    secondaryMuscles: ['trapezius'],
    equipment: 'Dumbbell',
    instructions: [
      'Hold dumbbells at sides with a slight forward torso pitch.',
      'Raise arms laterally leading with your elbows until parallel to ground.',
      'Pause briefly and lower under full resistance.'
    ],
    defaultSets: 4,
    defaultReps: 12,
    defaultRestSeconds: 60
  },
  {
    id: 'cable-lateral-raise',
    name: 'Cable Lateral Raise',
    category: 'Shoulders',
    primaryMuscles: ['front-deltoids'],
    secondaryMuscles: ['trapezius'],
    equipment: 'Cable',
    instructions: [
      'Set low pulley handle, stand sideways, and hold handle with outside hand.',
      'Raise arm out to shoulder level against constant cable tension.',
      'Lower smoothly across body to starting position.'
    ],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60
  },
  {
    id: 'machine-lateral-raise',
    name: 'Machine Lateral Raise',
    category: 'Shoulders',
    primaryMuscles: ['front-deltoids'],
    secondaryMuscles: ['trapezius'],
    equipment: 'Machine',
    instructions: [
      'Adjust seat so shoulder pivot points line up with machine axis.',
      'Push pads outward with elbows until upper arms are parallel to floor.',
      'Lower smoothly without resting weight between reps.'
    ],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60
  },
  {
    id: 'rear-delt-fly',
    name: 'Rear Delt Dumbbell Fly',
    category: 'Shoulders',
    primaryMuscles: ['back-deltoids'],
    secondaryMuscles: ['trapezius', 'upper-back'],
    equipment: 'Dumbbell',
    instructions: [
      'Hinge at hips with flat back until torso is almost parallel to floor.',
      'Raise dumbbells out to sides, feeling rear deltoids contract.',
      'Lower with control without swinging your torso.'
    ],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60
  },
  {
    id: 'reverse-pec-deck',
    name: 'Reverse Pec Deck (Rear Delt)',
    category: 'Shoulders',
    primaryMuscles: ['back-deltoids'],
    secondaryMuscles: ['trapezius', 'upper-back'],
    equipment: 'Machine',
    instructions: [
      'Sit facing the machine pad with handles set at shoulder height.',
      'Pull handles rearward in horizontal plane using posterior delts.',
      'Squeeze rear deltoids at peak and return smoothly.'
    ],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60
  },
  {
    id: 'face-pull',
    name: 'Rope Face Pull',
    category: 'Shoulders',
    primaryMuscles: ['back-deltoids', 'trapezius'],
    secondaryMuscles: ['upper-back'],
    equipment: 'Cable',
    instructions: [
      'Attach rope to cable set at eye level. Grip with palms facing inward.',
      'Pull rope to your face while externally rotating your shoulders.',
      'Hold the contraction for one full count before returning.'
    ],
    defaultSets: 3,
    defaultReps: 15,
    defaultRestSeconds: 60
  },
  {
    id: 'front-dumbbell-raise',
    name: 'Front Dumbbell Raise',
    category: 'Shoulders',
    primaryMuscles: ['front-deltoids'],
    secondaryMuscles: ['trapezius'],
    equipment: 'Dumbbell',
    instructions: [
      'Stand holding dumbbells across front of thighs.',
      'Raise one or both weights straight in front to shoulder height.',
      'Lower slowly without swaying.'
    ],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60
  },
  {
    id: 'upright-cable-row',
    name: 'Upright Cable Row',
    category: 'Shoulders',
    primaryMuscles: ['front-deltoids', 'trapezius'],
    secondaryMuscles: ['biceps'],
    equipment: 'Cable',
    instructions: [
      'Grip straight bar on low pulley with shoulder-width grip.',
      'Pull bar upward along torso, leading with your elbows.',
      'Stop at mid-chest line and lower with steady control.'
    ],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60
  },

  // ==========================================
  // ARMS (12 exercises)
  // ==========================================
  {
    id: 'barbell-bicep-curl',
    name: 'Standing Barbell Curl',
    category: 'Arms',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearm'],
    equipment: 'Barbell',
    instructions: [
      'Hold a barbell with shoulder-width underhand grip.',
      'Pin elbows at your sides and curl bar toward shoulders.',
      'Lower with control until arms are fully extended.'
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 60
  },
  {
    id: 'incline-dumbbell-curl',
    name: 'Incline Dumbbell Curl',
    category: 'Arms',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearm'],
    equipment: 'Dumbbell',
    instructions: [
      'Sit on bench inclined to 45 degrees with dumbbells hanging straight down.',
      'Curl dumbbells while keeping upper arms pointed vertically down.',
      'Lower under full stretch of the biceps long head.'
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 60
  },
  {
    id: 'hammer-curl',
    name: 'Dumbbell Hammer Curl',
    category: 'Arms',
    primaryMuscles: ['biceps', 'forearm'],
    secondaryMuscles: [],
    equipment: 'Dumbbell',
    instructions: [
      'Stand holding dumbbells with palms facing each other (neutral grip).',
      'Curl weights upward while keeping wrists rigid and neutral.',
      'Lower slowly to full extension.'
    ],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60
  },
  {
    id: 'preacher-curl',
    name: 'EZ-Bar Preacher Curl',
    category: 'Arms',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearm'],
    equipment: 'Barbell',
    instructions: [
      'Position armpits securely over edge of preacher pad.',
      'Curl EZ-bar upward towards chin, keeping triceps flat on pad.',
      'Lower under full control without letting elbows hyperextend at bottom.'
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 60
  },
  {
    id: 'concentration-curl',
    name: 'Seated Concentration Curl',
    category: 'Arms',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearm'],
    equipment: 'Dumbbell',
    instructions: [
      'Sit on bench, bracing back of elbow against inside of your thigh.',
      'Curl dumbbell up towards face with strict form.',
      'Squeeze peak bicep contraction for one second.'
    ],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 45
  },
  {
    id: 'cable-bicep-curl',
    name: 'Low Pulley Cable Curl',
    category: 'Arms',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearm'],
    equipment: 'Cable',
    instructions: [
      'Grip straight bar attached to low pulley cable.',
      'Curl bar up with constant tension throughout range of motion.',
      'Lower under tension.'
    ],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60
  },
  {
    id: 'tricep-rope-pushdown',
    name: 'Tricep Rope Pushdown',
    category: 'Arms',
    primaryMuscles: ['triceps'],
    secondaryMuscles: ['forearm'],
    equipment: 'Cable',
    instructions: [
      'Attach rope to high pulley. Keep elbows tucked tight to your ribs.',
      'Push rope down and flare ends outward at bottom.',
      'Return to 90 degree elbow bend with control.'
    ],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60
  },
  {
    id: 'straight-bar-pushdown',
    name: 'Straight Bar Tricep Pushdown',
    category: 'Arms',
    primaryMuscles: ['triceps'],
    secondaryMuscles: ['forearm'],
    equipment: 'Cable',
    instructions: [
      'Grip straight bar on high pulley with overhand grip.',
      'Press straight downward to lockout, flexing triceps hard.',
      'Allow bar to return to chest level without elbows drifting forward.'
    ],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60
  },
  {
    id: 'skull-crusher',
    name: 'Lying Tricep Skull Crusher',
    category: 'Arms',
    primaryMuscles: ['triceps'],
    secondaryMuscles: ['forearm'],
    equipment: 'Barbell',
    instructions: [
      'Lie flat holding EZ bar with arms extended vertical.',
      'Hinge at elbows only, lowering bar toward your forehead or bench top.',
      'Extend elbows to drive bar back up.'
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 75
  },
  {
    id: 'close-grip-bench-press',
    name: 'Close-Grip Bench Press',
    category: 'Arms',
    primaryMuscles: ['triceps', 'chest'],
    secondaryMuscles: ['front-deltoids'],
    equipment: 'Barbell',
    instructions: [
      'Grip barbell shoulder-width apart on flat bench.',
      'Lower bar to mid chest while keeping elbows tucked near sides.',
      'Press upward forcefully focusing on tricep extension.'
    ],
    defaultSets: 3,
    defaultReps: 8,
    defaultRestSeconds: 90
  },
  {
    id: 'overhead-dumbbell-tricep-extension',
    name: 'Overhead Dumbbell Tricep Extension',
    category: 'Arms',
    primaryMuscles: ['triceps'],
    secondaryMuscles: ['forearm'],
    equipment: 'Dumbbell',
    instructions: [
      'Hold a single dumbbell with both hands overhead.',
      'Lower the weight behind your head by bending elbows.',
      'Extend arms overhead to full tricep lockout.'
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 60
  },
  {
    id: 'wrist-curls',
    name: 'Barbell Wrist Curl',
    category: 'Arms',
    primaryMuscles: ['forearm'],
    secondaryMuscles: [],
    equipment: 'Barbell',
    instructions: [
      'Rest forearms on flat bench with wrists hanging over the edge.',
      'Curl the bar upward using wrists only, then lower smoothly.',
      'Perform high repetitions with controlled tempo.'
    ],
    defaultSets: 3,
    defaultReps: 15,
    defaultRestSeconds: 45
  },

  // ==========================================
  // LEGS (14 exercises)
  // ==========================================
  {
    id: 'barbell-back-squat',
    name: 'Barbell Back Squat',
    category: 'Legs',
    primaryMuscles: ['quadriceps', 'gluteal'],
    secondaryMuscles: ['hamstring', 'calves', 'lower-back', 'abs'],
    equipment: 'Barbell',
    instructions: [
      'Rest bar across upper traps. Stance slightly wider than shoulders.',
      'Brace core and sit down between your hips until thighs break parallel.',
      'Drive straight up through mid-foot to starting standing position.'
    ],
    defaultSets: 4,
    defaultReps: 6,
    defaultRestSeconds: 120
  },
  {
    id: 'front-squat',
    name: 'Barbell Front Squat',
    category: 'Legs',
    primaryMuscles: ['quadriceps'],
    secondaryMuscles: ['gluteal', 'abs', 'upper-back'],
    equipment: 'Barbell',
    instructions: [
      'Rack bar across anterior shoulders with elbows pointed high forward.',
      'Squat down keeping torso upright.',
      'Drive up through whole foot, maintaining high elbow position.'
    ],
    defaultSets: 3,
    defaultReps: 8,
    defaultRestSeconds: 90
  },
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift',
    category: 'Legs',
    primaryMuscles: ['hamstring', 'gluteal'],
    secondaryMuscles: ['lower-back', 'forearm'],
    equipment: 'Barbell',
    instructions: [
      'Hold bar at hip height. Keep knees soft with slight bend.',
      'Push hips straight back while lowering bar along shins.',
      'Contract glutes and pull hips forward to stand tall.'
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 90
  },
  {
    id: 'stiff-leg-deadlift',
    name: 'Stiff-Leg Deadlift',
    category: 'Legs',
    primaryMuscles: ['hamstring'],
    secondaryMuscles: ['gluteal', 'lower-back'],
    equipment: 'Barbell',
    instructions: [
      'Stand with legs almost completely straight.',
      'Hinge forward from hips until bar approaches floor and hamstrings are fully stretched.',
      'Return to standing position using posterior chain.'
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 90
  },
  {
    id: 'leg-press',
    name: 'Incline Leg Press',
    category: 'Legs',
    primaryMuscles: ['quadriceps', 'gluteal'],
    secondaryMuscles: ['hamstring', 'calves'],
    equipment: 'Machine',
    instructions: [
      'Place feet shoulder-width on footplate.',
      'Lower weight platform until knees reach 90 degree angle.',
      'Press through full foot, stopping just short of knee lockout.'
    ],
    defaultSets: 4,
    defaultReps: 10,
    defaultRestSeconds: 90
  },
  {
    id: 'hack-squat',
    name: 'Machine Hack Squat',
    category: 'Legs',
    primaryMuscles: ['quadriceps'],
    secondaryMuscles: ['gluteal', 'calves'],
    equipment: 'Machine',
    instructions: [
      'Place shoulders under pads with back flat against backrest.',
      'Squat down deeply, allowing knees to track over toes.',
      'Press through mid-foot to return to top.'
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 90
  },
  {
    id: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squat',
    category: 'Legs',
    primaryMuscles: ['quadriceps', 'gluteal'],
    secondaryMuscles: ['hamstring', 'calves'],
    equipment: 'Dumbbell',
    instructions: [
      'Rest back foot on bench behind you. Hold dumbbells at sides.',
      'Lower rear knee towards floor until front thigh is parallel to ground.',
      'Drive up through front heel to return to starting position.'
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 75
  },
  {
    id: 'walking-lunges',
    name: 'Dumbbell Walking Lunges',
    category: 'Legs',
    primaryMuscles: ['quadriceps', 'gluteal'],
    secondaryMuscles: ['hamstring', 'calves'],
    equipment: 'Dumbbell',
    instructions: [
      'Step forward into a deep lunge, lowering back knee towards floor.',
      'Drive through front heel to step directly into the next lunge step.',
      'Maintain an upright torso throughout.'
    ],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60
  },
  {
    id: 'barbell-hip-thrust',
    name: 'Barbell Hip Thrust',
    category: 'Legs',
    primaryMuscles: ['gluteal'],
    secondaryMuscles: ['hamstring', 'quadriceps'],
    equipment: 'Barbell',
    instructions: [
      'Rest upper back on flat bench with padded bar over hips.',
      'Drive through heels and extend hips upward until thighs align with torso.',
      'Squeeze glutes at peak for one second, then lower.'
    ],
    defaultSets: 4,
    defaultReps: 10,
    defaultRestSeconds: 90
  },
  {
    id: 'leg-extension',
    name: 'Seated Leg Extension',
    category: 'Legs',
    primaryMuscles: ['quadriceps'],
    secondaryMuscles: [],
    equipment: 'Machine',
    instructions: [
      'Sit with knees aligned with machine pivot. Pad resting on lower shins.',
      'Extend legs upward until knees are straight.',
      'Hold peak contraction for a second, then lower slowly.'
    ],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60
  },
  {
    id: 'lying-leg-curl',
    name: 'Lying Hamstring Leg Curl',
    category: 'Legs',
    primaryMuscles: ['hamstring'],
    secondaryMuscles: ['calves'],
    equipment: 'Machine',
    instructions: [
      'Lie face down with roller pad positioned above heels.',
      'Curl heels up toward glutes smoothly.',
      'Lower weight under resistance to full leg extension.'
    ],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60
  },
  {
    id: 'seated-leg-curl',
    name: 'Seated Hamstring Leg Curl',
    category: 'Legs',
    primaryMuscles: ['hamstring'],
    secondaryMuscles: ['calves'],
    equipment: 'Machine',
    instructions: [
      'Sit with thighs secured firmly under holding pad.',
      'Curl heels downward and backward under the seat.',
      'Control the return up to full extension.'
    ],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60
  },
  {
    id: 'standing-calf-raise',
    name: 'Standing Calf Raise',
    category: 'Legs',
    primaryMuscles: ['calves'],
    secondaryMuscles: [],
    equipment: 'Machine',
    instructions: [
      'Balls of feet on platform, heels hanging over edge.',
      'Lower heels as deep as possible to stretch calves.',
      'Push up onto tiptoes and hold peak contraction for one second.'
    ],
    defaultSets: 4,
    defaultReps: 15,
    defaultRestSeconds: 45
  },
  {
    id: 'seated-calf-raise',
    name: 'Seated Calf Raise',
    category: 'Legs',
    primaryMuscles: ['calves'],
    secondaryMuscles: [],
    equipment: 'Machine',
    instructions: [
      'Sit with thighs locked under pads and balls of feet on platform.',
      'Lower heels to full stretch.',
      'Elevate heels high, flexing the soleus muscle.'
    ],
    defaultSets: 3,
    defaultReps: 15,
    defaultRestSeconds: 45
  },

  // ==========================================
  // CORE (9 exercises)
  // ==========================================
  {
    id: 'hanging-leg-raise',
    name: 'Hanging Leg Raise',
    category: 'Core',
    primaryMuscles: ['abs'],
    secondaryMuscles: ['forearm'],
    equipment: 'Bodyweight',
    instructions: [
      'Hang from pull-up bar with straight arms.',
      'Raise straight legs in front of you until parallel to ground or higher.',
      'Lower with control without swinging.'
    ],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60
  },
  {
    id: 'captains-chair-knee-raise',
    name: 'Captains Chair Knee Raise',
    category: 'Core',
    primaryMuscles: ['abs'],
    secondaryMuscles: [],
    equipment: 'Machine',
    instructions: [
      'Support bodyweight on forearms with back flat against pad.',
      'Draw knees up into chest, rolling pelvis upward.',
      'Lower legs slowly without letting back arch off pad.'
    ],
    defaultSets: 3,
    defaultReps: 15,
    defaultRestSeconds: 60
  },
  {
    id: 'cable-kneeling-crunch',
    name: 'Kneeling Cable Crunch',
    category: 'Core',
    primaryMuscles: ['abs'],
    secondaryMuscles: [],
    equipment: 'Cable',
    instructions: [
      'Kneel in front of high cable rope, holding rope ends at your temples.',
      'Flex spine and curl ribs toward pelvis.',
      'Squeeze abdominals tightly, then return with control.'
    ],
    defaultSets: 3,
    defaultReps: 15,
    defaultRestSeconds: 60
  },
  {
    id: 'cable-woodchopper',
    name: 'Standing Cable Woodchopper',
    category: 'Core',
    primaryMuscles: ['obliques', 'abs'],
    secondaryMuscles: ['front-deltoids'],
    equipment: 'Cable',
    instructions: [
      'Set pulley at shoulder height. Stand sideways and hold handle with both hands.',
      'Rotate torso across your body diagonally.',
      'Control the return to starting position.'
    ],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 45
  },
  {
    id: 'ab-wheel-rollout',
    name: 'Ab Wheel Rollout',
    category: 'Core',
    primaryMuscles: ['abs'],
    secondaryMuscles: ['upper-back', 'triceps'],
    equipment: 'Bodyweight',
    instructions: [
      'Kneel holding ab wheel handles directly beneath shoulders.',
      'Roll wheel forward, extending body into a straight line near floor.',
      'Pull back up by contracting abs.'
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 60
  },
  {
    id: 'forearm-plank',
    name: 'Forearm Plank',
    category: 'Core',
    primaryMuscles: ['abs', 'obliques'],
    secondaryMuscles: ['quadriceps', 'trapezius'],
    equipment: 'Bodyweight',
    instructions: [
      'Rest on forearms with elbows directly under shoulders.',
      'Maintain rigid straight line from heels to crown of head.',
      'Keep glutes and core braced for entire duration.'
    ],
    defaultSets: 3,
    defaultReps: 45, // seconds
    defaultRestSeconds: 60
  },
  {
    id: 'side-plank',
    name: 'Side Plank',
    category: 'Core',
    primaryMuscles: ['obliques', 'abs'],
    secondaryMuscles: ['gluteal'],
    equipment: 'Bodyweight',
    instructions: [
      'Lie on side supported by forearm directly under shoulder.',
      'Raise hips until body forms a straight diagonal line.',
      'Hold position rigidly without letting hips sag.'
    ],
    defaultSets: 3,
    defaultReps: 30, // seconds
    defaultRestSeconds: 45
  },
  {
    id: 'decline-sit-up',
    name: 'Decline Bench Sit-up',
    category: 'Core',
    primaryMuscles: ['abs'],
    secondaryMuscles: ['obliques'],
    equipment: 'Bodyweight',
    instructions: [
      'Hook feet on decline bench and cross hands across chest.',
      'Curl torso upward, contracting abs until sitting upright.',
      'Lower torso under control back down.'
    ],
    defaultSets: 3,
    defaultReps: 15,
    defaultRestSeconds: 60
  },
  {
    id: 'russian-twist',
    name: 'Russian Twist',
    category: 'Core',
    primaryMuscles: ['obliques', 'abs'],
    secondaryMuscles: [],
    equipment: 'Dumbbell',
    instructions: [
      'Sit on floor with knees bent and feet elevated slightly.',
      'Hold a dumbbell at chest height and rotate torso from side to side.',
      'Keep movement controlled and avoid swinging arms.'
    ],
    defaultSets: 3,
    defaultReps: 20,
    defaultRestSeconds: 45
  }
];

export const MUSCLE_LABEL_MAP: Record<string, string> = {
  'chest': 'Chest (Pectorals)',
  'front-deltoids': 'Front & Lateral Shoulders',
  'back-deltoids': 'Rear Deltoids',
  'biceps': 'Biceps',
  'triceps': 'Triceps',
  'forearm': 'Forearms',
  'trapezius': 'Trapezius',
  'upper-back': 'Upper Back (Lats & Rhomboids)',
  'lower-back': 'Lower Back (Erector Spinae)',
  'abs': 'Abdominals',
  'obliques': 'Obliques',
  'quadriceps': 'Quadriceps',
  'hamstring': 'Hamstrings',
  'gluteal': 'Glutes',
  'calves': 'Calves'
};

# Exploring SLAM and LiDAR: Computing the Fixed Point of Autonomous Driving

## 1. Why SLAM?
Autonomous vehicles must locate themselves and perceive their surroundings in unknown, changing environments. This is the Simultaneous Localization and Mapping (SLAM) problem: estimate robot/vehicle state and map simultaneously so that sensor observations iteratively refine both until a stable posterior emerges.

- **Localization**: Pose estimation in the world frame (position x/y/z and orientation roll/pitch/yaw).
- **Mapping**: Build feature- or grid-based representations for planning and obstacle avoidance.

The heart of SLAM is iterative state estimation. Filtering or optimisation schemes converge to a stable solution—precisely the computational fixed point.

## 2. Role of LiDAR
LiDAR emits laser pulses and measures return times to produce dense, precise range data. Unlike cameras, LiDAR is lighting agnostic and provides 3D point clouds, making it invaluable for autonomous driving.

LiDAR contributes to SLAM by providing:

1. **High-fidelity observations** for map construction.
2. **Odometric constraints**: point-cloud registration (ICP, NDT) yields frame-to-frame motion.
3. **Loop closure cues** through cloud matching of revisited areas.

## 3. Classic SLAM Frameworks
SLAM can be framed as an implicit fixed-point problem. Let state be \(\mathbf{x}\), map \(\mathbf{m}\), observation \(\mathbf{z}\), and control \(\mathbf{u}\). The Bayesian recursion is

\[
p(\mathbf{x}_t, \mathbf{m} \mid \mathbf{z}_{1:t}, \mathbf{u}_{1:t}) \propto p(\mathbf{z}_t \mid \mathbf{x}_t, \mathbf{m}) \int p(\mathbf{x}_t \mid \mathbf{x}_{t-1}, \mathbf{u}_t) p(\mathbf{x}_{t-1}, \mathbf{m} \mid \mathbf{z}_{1:t-1}, \mathbf{u}_{1:t-1}) d\mathbf{x}_{t-1}.
\]

Iterative filtering/optimisation hunts the posterior mode/mean until convergence—our fixed point.

### 3.1 Filtering-based SLAM
- **EKF-SLAM**: Extended Kalman filter handles nonlinear motion; predict-update cycles adjust the state until covariance stabilises.
- **FastSLAM**: Particle filter factorises pose and landmark estimates; sufficient particles and iterations lead to convergence.

### 3.2 Graph-based SLAM
- **Graph SLAM**: Each pose is a node, sensor constraints are edges. Optimise objective \(F(\mathbf{x})\) via Gauss-Newton/Levenberg-Marquardt to find \(\nabla F(\mathbf{x}^*) = 0\).
- **LOAM**: LiDAR odometry from features feeds the back-end optimisation.

## 4. Building a LiDAR SLAM Pipeline
1. **Sensor sync & preprocessing**
   - Time-align and deskew LiDAR scans using IMU/odometry.
   - Filter clouds via voxel grids or statistical outlier removal.
2. **Front-end estimation**
   - Point-cloud registration (ICP/NDT or feature matching) for relative poses.
   - Output odometry as initial guesses.
3. **Back-end optimisation**
   - Build pose graphs with odometry and loop-closure edges.
   - Solve for \(\mathbf{x}^*\) through nonlinear optimisation—the state fixed point.
4. **Map representation**
   - Sparse landmarks (key points/segments) or dense grids/voxels (OctoMap, voxel hashing).
5. **Loop closure & consistency**
   - Use Scan Context, FPFH, etc. to recognise revisits.
   - Inject loop constraints, re-optimise, and restore the global fixed point.

## 5. Mathematical View of Fixed Points
Fixed points appear at multiple levels:

- **Filter iteration**: Stable state satisfies \(\mathbf{x}_t = f(\mathbf{x}_t)\).
- **Optimisation**: Back-end gradient zero, \(\nabla F(\mathbf{x}^*) = 0\).
- **Loop convergence**: Global map error approaches zero, yielding \(\mathbf{m}^*\).

Achieving the fixed point means reliable localisation and mapping, enabling downstream perception, prediction, planning, and control.

## 6. Engineering Notes
- **Sensor fusion**: Combine IMU, GNSS, cameras using factor graphs or tightly coupled filters for robustness.
- **Real-time performance**: On embedded hardware, reduce load through downsampling and keyframes.
- **Reliability**: Add outlier rejection and relocalisation for sensor dropouts/occlusions.
- **Datasets & simulation**: Validate on KITTI, nuScenes, etc., and stress-test via Carla, LGSVL.

## 7. Conclusion
LiDAR SLAM delivers precise, resilient perception for autonomous vehicles. Designing solid front-end/back-end pipelines and locating the estimation fixed point yields high-accuracy localisation, consistent maps, and closed-loop performance in the wild.

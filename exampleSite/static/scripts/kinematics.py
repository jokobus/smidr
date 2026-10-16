import numpy as np

def forward_kinematics(theta1_deg, theta2_deg, l1=1.0, l2=0.8):
    """
    Computes end-effector (x, y) coordinates for a 2-DOF planar robotic arm.
    :param theta1_deg: Base joint angle in degrees
    :param theta2_deg: Elbow joint angle in degrees
    :param l1: Length of link 1 (meters)
    :param l2: Length of link 2 (meters)
    """
    t1 = np.deg2rad(theta1_deg)
    t2 = np.deg2rad(theta2_deg)
    
    x1 = l1 * np.cos(t1)
    y1 = l1 * np.sin(t1)
    
    x_ee = x1 + l2 * np.cos(t1 + t2)
    y_ee = y1 + l2 * np.sin(t1 + t2)
    
    return (x1, y1), (x_ee, y_ee)

if __name__ == "__main__":
    elbow, ee = forward_kinematics(45.0, 30.0)
    print(f"Elbow Joint Position:  x={elbow[0]:.4f} m, y={elbow[1]:.4f} m")
    print(f"End-Effector Position: x={ee[0]:.4f} m, y={ee[1]:.4f} m")

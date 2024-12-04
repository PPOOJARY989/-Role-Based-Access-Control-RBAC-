import { useState } from "react";
import toast from "react-hot-toast";
import './styles.css';

const roles = [
    {
        name: "Super Admin",
        count: 15,
        permissions: ["Threat Detection", "Network Security", "Access Control"],
        users: ["user1", "user2", "user3", "user4", "user5"],
    },
    {
        name: "Manager",
        count: 7,
        permissions: ["Threat Detection", "Incident Response"],
        users: ["user6", "user7", "user8", "user9"],
    },
    {
        name: "Accountant",
        count: 3,
        permissions: ["Data Protection"],
        users: ["user10", "user11", "user12"],
    },
];

const categories = [
    "Threat Detection",
    "Data Protection",
    "Network Security",
    "Incident Response",
    "Access Control",
    "Vulnerability Management",
];

export default function RolesCard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roleData, setRoleData] = useState(null);
    const [newRoleName, setNewRoleName] = useState("");
    const [permissions, setPermissions] = useState({});
    const [isEditable, setIsEditable] = useState(true);

    const handleModalClose = () => {
        setIsModalOpen(false);
        setRoleData(null);
        setPermissions({});
        setIsEditable(false);
    };

    const handleRoleClick = (role) => {
        setRoleData(role);
        setNewRoleName(role.name);
        setIsEditable(false);
        const updatedPermissions = {};
        categories.forEach((category) => {
            updatedPermissions[category] = {
                read: role.permissions.includes(category),
                write: role.permissions.includes(category),
                edit: role.permissions.includes(category),
            };
        });
        setPermissions(updatedPermissions);
        setIsModalOpen(true);
    };

    const handleAddNewRole = () => {
        setRoleData(null);
        setNewRoleName("");
        setPermissions(
            categories.reduce((acc, category) => {
                acc[category] = { read: false, write: false, edit: false };
                return acc;
            }, {})
        );
        setIsEditable(true);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!newRoleName) {
            toast.error("Role Name is required");
            return;
        }
        const newRole = {
            name: newRoleName,
            count: 0,
            permissions: categories.filter((category) => permissions[category].read),
            users: [],
        };
        roles.push(newRole);
        setIsModalOpen(false);
        toast.success("Role added successfully");
    };

    return (
        <div className="roles-card">
            <div className="header">
                <h2 className="title">Administrator Roles Available</h2>
                <button
                    className="btn-add-role"
                    onClick={handleAddNewRole}
                >
                    + Add New Roles
                </button>
            </div>
            <p className="info-text">
                A role provides access to predefined menus and features, enabling
                administrators to access what they need based on their role.
            </p>
            <div className="role-grid">
                {roles.map((role) => (
                    <div
                        key={role.name}
                        className="role-card"
                        onClick={() => handleRoleClick(role)}
                    >
                        <h3 className="role-name">{role.name}</h3>
                        <p className="role-count">{role.count} Accounts</p>
                        <div className="avatar-container">
                            {role.users.slice(0, 4).map((user, index) => (
                                <img
                                    key={index}
                                    src={`https://i.pravatar.cc/150?img=${index + 1}`}
                                    alt={`Avatar of ${user}`}
                                    className="avatar"
                                />
                            ))}
                            {role.count > 4 && (
                                <div className="extra-users">
                                    {role.count - 4 > 10 ? "10+" : `${role.count - 4}+`}
                                </div>
                            )}
                        </div>
                        <p className="role-permissions">
                            {role.permissions.join(", ")}
                        </p>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{roleData ? "Role Details" : "Add New Role"}</h2>
                            {!isEditable && (
                                <button
                                    className="btn-edit"
                                    onClick={() => setIsEditable(true)}
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                        <input
                            type="text"
                            className="input-role-name"
                            placeholder="Role Name"
                            value={newRoleName}
                            onChange={(e) => setNewRoleName(e.target.value)}
                            disabled={!isEditable}
                        />
                        <div className="permissions-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Category</th>
                                        <th>Read</th>
                                        <th>Write</th>
                                        <th>Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((category) => (
                                        <tr key={category}>
                                            <td>{category}</td>
                                            {["read", "write", "edit"].map((type) => (
                                                <td key={type} className="checkbox-cell">
                                                    <input
                                                        type="checkbox"
                                                        className="checkbox"
                                                        checked={permissions[category]?.[type] || false}
                                                        onChange={() =>
                                                            setPermissions((prev) => ({
                                                                ...prev,
                                                                [category]: {
                                                                    ...prev[category],
                                                                    [type]: !prev[category][type],
                                                                },
                                                            }))
                                                        }
                                                        disabled={!isEditable}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn-cancel"
                                onClick={handleModalClose}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-save"
                                onClick={handleSave}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

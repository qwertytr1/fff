import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import store from "../../store/store"
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProfilePage.css"; // Custom CSS for additional styling
import { Context } from "../..";

const ProfilePage = observer(() => {
    const {store} = useContext(Context);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: store.user.username,
    email: store.user.email,
    language: store.user.language,
    theme: store.user.theme,
  });
console.log(formData)
  const handleEditProfile = () => {
    setIsEditing(true);
  };
  const handleSaveChanges = async () => {
    try {
      const updatedFields: Partial<typeof formData> = {};

      (Object.keys(formData) as Array<keyof typeof formData>).forEach((key) => {
        if (formData[key] !== store.user[key]) {
          updatedFields[key] = formData[key];
        }
      });

      if (Object.keys(updatedFields).length > 0) {
        const userData = {
          username: formData.username ?? store.user.username ?? '',
          email: formData.email ?? store.user.email ?? '',
          password: "", // Пароль не меняется
          language: formData.language ?? store.user.language ?? '',
          theme: formData.theme ?? store.user.theme ?? '',
          role: store.user.role ?? '',
        };

        const updatedUser = await store.edit(store.user.id, userData);
        store.setUser(updatedUser);
      } else {
        alert("No changes detected.");
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile changes:", error);
      alert("Failed to save changes. Please try again.");
    }
  };
  const handleCancelChanges = () => {
    setFormData({
      username: store.user.username,
      email: store.user.email,
      language: store.user.language,
      theme: store.user.theme,
    });
    setIsEditing(false);
  };

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="profile-container container mt-5">
      <div className="card shadow">
        <div className="card-header text-center">
          <h3 className="profile-title">Profile Page</h3>
        </div>
        <div className="card-body">
          {isEditing ? (
            <>
              <div className="form-group">
                <label>Username:</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group mt-2">
                <label>Email:</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group mt-2">
                <label>Language:</label>
                <input
                  type="text"
                  className="form-control"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group mt-2">
                <label>Theme:</label>
                <input
                  type="text"
                  className="form-control"
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                />
              </div>
              <div className="text-center mt-4">
                <button className="btn btn-success me-2" onClick={handleSaveChanges}>Save</button>
                <button className="btn btn-secondary" onClick={handleCancelChanges}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <p><strong>Username:</strong> {store.user.username}</p>
              <p><strong>Email:</strong> {store.user.email}</p>
              <p><strong>Language:</strong> {store.user.language}</p>
              <p><strong>Theme:</strong> {store.user.theme}</p>
              <p><strong>Role:</strong> {store.user.role}</p>

              <div className="text-center mt-4">
                <button className="btn btn-primary" onClick={handleEditProfile}>Edit Profile</button>
              </div>
            </>
          )}

          {store.user.role === "admin" && (
            <div className="text-center mt-3">
              <a href="/admin" className="btn btn-warning">Go to Admin Panel</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default ProfilePage;

import React, { useState, useEffect } from 'react';
import UserTeamModal from './UserTeamModal';

const UsersList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const pageSize = 20; // Adjust as needed

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase()); // Lowercase for search
  };

  const handleDomainChange = (event) => {
    setSelectedDomain(event.target.value);
  };

  const handleGenderChange = (event) => {
    setSelectedGender(event.target.value);
  };

  const handleAvailabilityChange = (event) => {
    setSelectedAvailability(event.target.value);
  };

  const handleUserCheckboxChange = (event, user) => {
    const newSelectedUsers = [...selectedUsers];
    const userIndex = newSelectedUsers.findIndex(u => u.id === user.id);
  
    if (userIndex >= 0) {   
        newSelectedUsers.splice(userIndex, 1);
        alert("Removed From Team");
    } else {
      // User newly selected, add to selection with validation
      const hasSameDomain = newSelectedUsers.some(u => u.domain === user.domain);
      if(!user.available){
        alert("Please Select users who are available!")
        return
      }
      else if (!hasSameDomain) {
        newSelectedUsers.push(user);
      } else {
        alert('Please select a user from a different domain.');
        return
      }
        alert("Added To Team")
    }
  
    setSelectedUsers(newSelectedUsers);
  };
  

  useEffect(() => {
  const fetchData = async () => {
    const search = searchTerm.toLowerCase();
    const domain = selectedDomain ? `&domain=${selectedDomain}` : '';
    const gender = selectedGender ? `&gender=${selectedGender}` : '';
    const availability = selectedAvailability ? `&availability=${selectedAvailability}` : '';

    const response = await fetch(`http://localhost:3000/users?q=${search}${domain}${gender}${availability}&page=${currentPage}&limit=${pageSize}`);
    const data = await response.json();
    setUsers(data.data);
    setTotalPages(data.totalPages);
  };

  fetchData();
}, [searchTerm, currentPage, selectedDomain, selectedGender, selectedAvailability]);


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="user-list-container">
        {isModalOpen && (
            <UserTeamModal
                selectedUsers={selectedUsers}
                onRemoveUser={handleUserCheckboxChange}
                onClose={() => setIsModalOpen(false)} // Close modal on onClose handler
            />
        )}
        <div className="top-section">
            <btn className='view-team bg-blue-500 hover:bg-blue-700 rounded-lg text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                onClick={() => setIsModalOpen(!isModalOpen)}
                >
                View Your Team ({selectedUsers.length})
            </btn>
            <h1 className="users-title text-center">All the Users</h1>
            <div className="search-container flex justify-center items-center h-full">
                <input
                id="searchInput"
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by Name"
                className="search-input"
                />
            </div>
            <h3 className='text-center text-lg font-bold'>Filters</h3>
            <div class="flex justify-center">
            <ul className="filter-list">
                <li>
                <select value={selectedDomain} onChange={handleDomainChange} className="filter-select">
                    <option value="">All Domains</option>
                    <option value="sales">Sales</option>
                    <option value="finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="IT">IT</option>
                    <option value="Management">Management</option>
                    <option value="UI Designing">UI Designing</option>
                    <option value="Business Development">Business Development</option>
                </select>
                </li>
                <li>
                <select value={selectedGender} onChange={handleGenderChange} className="filter-select">
                    <option value="">All Genders</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                </li>
                <li>
                <select value={selectedAvailability} onChange={handleAvailabilityChange} className="filter-select">
                    <option value="">All Availability</option>
                    <option value="true">Available</option>
                    <option value="false">Unavailable</option>
                </select>
                </li>
            </ul>
            </div>
        </div>

      <div className="user-cards ">
        {users.map((user) => (
          <div key={user.id} className="user-card bg-gray-400 shadow-md">
            <div className='card-top'>
                <img src={user.avatar} alt={user.first_name + ' ' + user.last_name} className='user-avatar' />
                <div>
                    <h3>{user.first_name} {user.last_name}</h3>
                    <p>{user.email}</p>
                </div>
            </div>
            <div className="user-info">
                <div>
                    <p><span className='bold'>Domain</span> {user.domain}</p>
                    <p><span className='bold'>Gender</span> {user.gender}</p>
                </div>
              {user.available ? (
                <span className="availability-label available">Available</span>
              ) : (
                <span className="availability-label unavailable">Unavailable</span>
              )}
            </div>
            <button className='add-to-team' onClick={() => handleUserCheckboxChange(this, user)}>
                {selectedUsers.some(selectedUser => selectedUser.id === user.id)
                    ? 'Remove from Team'
                    : 'Add to Team'}
            </button>

          </div>
        ))}
      </div>

      {/* Pagination controls */}
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersList;

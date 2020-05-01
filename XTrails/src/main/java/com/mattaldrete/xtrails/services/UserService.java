package com.mattaldrete.xtrails.services;

import com.mattaldrete.enitities.User;

public interface UserService {

	public User findById(Integer id);

	public User findByUserName(String username);

	public User updateUser(User updatedUser);

}

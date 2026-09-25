package com.api_gateway.Configuration;

import com.api_gateway.Entity.User;
import org.ietf.jgss.Oid;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.List;
import java.util.Map;

//for storing in-memory user details after successful login, so that every time user db needs not to call
public class AppUserPrincipal implements OidcUser
{
    //user stores the googleId, email

    private User user;
    private OidcUser oidcUser;

    public AppUserPrincipal(User user, OidcUser oidcUser)
    {
        this.user=user;
        this.oidcUser=oidcUser;
    }

    public User getUser() {
        return this.user;
    }

    @Override
    public Map<String, Object> getClaims() {
        return oidcUser.getClaims();
    }

    @Override
    public @Nullable OidcUserInfo getUserInfo() {
        return oidcUser.getUserInfo();
    }

    @Override
    public OidcIdToken getIdToken() {
        return oidcUser.getIdToken();
    }

    @Override
    public Map<String, Object> getAttributes() {
        return oidcUser.getAttributes();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return oidcUser.getAuthorities();
    }

    @Override
    public String getName() {
        return String.valueOf(user.getOpenId());
    }
}

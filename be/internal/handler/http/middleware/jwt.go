package middleware

import (
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/ramadhia/estrada/be/internal/model"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

const (
	jwtData     = "JWT_DATA"
	tokenBearer = "TOKEN_BEARER"
)

type User struct {
	ID        string   `json:"user_id" binding:"required"`
	Email     string   `json:"email" binding:"required"`
	FirstName string   `json:"first_name" binding:"required"`
	LastName  string   `json:"last_name" binding:"required"`
	Scope     []string `json:"scope" binding:"required"`
	Tenant    string   `json:"tenant" binding:"required"`
	Role      string   `json:"role"`
	IsClient  bool     `json:"is_client"`
}

func (u User) ToModel(token string) (model.Claim, error) {
	return model.Claim{
		ID:       u.ID,
		Email:    u.Email,
		Scope:    u.Scope,
		Role:     u.Role,
		IsClient: u.IsClient,
		Token:    token,
	}, nil
}

type JWTData struct {
	jwt.StandardClaims
	User
}

func NewHmacJwtMiddleware(secretKey []byte) gin.HandlerFunc {
	return func(c *gin.Context) {
		bearer := getBearerAuth(c.Request)
		if bearer == nil {
			_ = c.AbortWithError(http.StatusUnauthorized, errors.New("missing bearer token"))
			return
		}
		jwtObj, err := decodeHmacJwtData(secretKey, *bearer)
		if err != nil {
			_ = c.AbortWithError(http.StatusUnauthorized, err)
			return
		}
		if jwtObj.ID == "" && len(jwtObj.Scope) == 0 && !jwtObj.IsClient {
			_ = c.AbortWithError(http.StatusUnauthorized, errors.New("invalid token"))
			return
		}
		c.Set(jwtData, jwtObj.User)
		c.Set(tokenBearer, *bearer)

		c.Next()
	}
}

func GetClaim(c *gin.Context) (model.Claim, error) {
	anyObj, exist := c.Get(jwtData)
	if !exist {
		return model.Claim{}, errors.New("user not found")
	}
	user, validType := anyObj.(User)
	if !validType {
		return model.Claim{}, errors.New("invalid user type")
	}

	tokenObj, exist := c.Get(tokenBearer)
	if !exist {
		return model.Claim{}, errors.New("missing token")
	}
	token, validType := tokenObj.(string)
	if !validType {
		return model.Claim{}, errors.New("invalid token type")
	}

	return user.ToModel(token)
}

func getBearerAuth(r *http.Request) *string {
	authHeader := r.Header.Get("Authorization")
	authForm := r.Form.Get("code")
	if authHeader == "" && authForm == "" {
		return nil
	}
	token := authForm
	if authHeader != "" {
		s := strings.SplitN(authHeader, " ", 2)
		if (len(s) != 2 || strings.ToLower(s[0]) != "bearer") && token == "" {
			return nil
		}
		// Use authorization header token only if token type is bearer else query string access token would be returned
		if len(s) > 0 && strings.ToLower(s[0]) == "bearer" {
			token = s[1]
		}
	}
	return &token
}

func decodeHmacJwtData(hmacSecret []byte, tokenStr string) (*JWTData, error) {
	var claim JWTData

	secretFn := func(token *jwt.Token) (interface{}, error) {
		if _, validSignMethod := token.Method.(*jwt.SigningMethodHMAC); !validSignMethod {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return hmacSecret, nil
	}

	token, err := jwt.ParseWithClaims(tokenStr, &claim, secretFn)
	if err != nil {
		return nil, err
	}

	if claim, ok := token.Claims.(*JWTData); ok && token.Valid {
		return claim, nil
	}

	return nil, fmt.Errorf("invalid token")
}

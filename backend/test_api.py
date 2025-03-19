import requests
import json
import os
import sys
import time
from datetime import datetime
import random

# Configuration
BASE_URL = "http://localhost:8000/api/v1"
RESULTS_DIR = "test_results"

# Create results directory if it doesn't exist
os.makedirs(RESULTS_DIR, exist_ok=True)

# Test user data
TEST_USER = {
    "email": f"test{random.randint(1000, 9999)}@example.com",
    "password": "password123",
    "confirm_password": "password123",
    "first_name": "Test",
    "last_name": "User",
    "role": "student",
    "phone_number": "555-123-4567"
}

# Global variables
access_token = None
test_results = {}

def save_response(name, response, is_error=False):
    """Save API response to a JSON file."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    try:
        # Try to parse response as JSON
        data = response.json() if not is_error else response
    except:
        # If it's not JSON, save text content
        data = {"text": response.text} if not is_error else response

    # Add response metadata
    if not is_error:
        data = {
            "status_code": response.status_code,
            "elapsed_time": response.elapsed.total_seconds(),
            "headers": dict(response.headers),
            "response": data
        }
        
    # Create the filename
    filename = f"{name}_{timestamp}.json"
    if is_error:
        filename = f"ERROR_{filename}"
    
    # Save to file
    with open(os.path.join(RESULTS_DIR, filename), 'w') as f:
        json.dump(data, f, indent=2)
    
    # Also store in memory
    test_results[name] = {
        "success": not is_error,
        "data": data,
        "file": filename
    }
    
    return data

def print_test_result(name, success):
    """Print formatted test result."""
    result = "✅ PASSED" if success else "❌ FAILED"
    print(f"{result} - {name}")

def run_test(func):
    """Decorator for running a test function."""
    def wrapper(*args, **kwargs):
        test_name = func.__name__
        print(f"Running test: {test_name}...")
        
        try:
            result = func(*args, **kwargs)
            is_success = isinstance(result, requests.Response) and result.ok
            print_test_result(test_name, is_success)
            return result
        except Exception as e:
            error_data = {
                "error": str(e),
                "type": type(e).__name__
            }
            save_response(test_name, error_data, is_error=True)
            print_test_result(test_name, False)
            print(f"  Error: {e}")
            return None
            
    return wrapper

# Authentication Tests
@run_test
def test_register():
    """Test user registration."""
    url = f"{BASE_URL}/auth/register"
    response = requests.post(url, json=TEST_USER)
    save_response("register", response)
    return response

@run_test
def test_login():
    """Test user login."""
    global access_token  # Declare global at beginning of function
    
    url = f"{BASE_URL}/auth/login"
    response = requests.post(
        url, 
        data={
            "username": TEST_USER["email"],
            "password": TEST_USER["password"]
        }
    )
    data = save_response("login", response)
    
    # Save token for subsequent tests
    if response.ok:
        access_token = data["response"]["access_token"]
        print(f"  Access token obtained: {access_token[:10]}...")
        
    return response

@run_test
def test_refresh_token():
    """Test token refresh."""
    global access_token  # Declare global at beginning of function
    
    url = f"{BASE_URL}/auth/refresh-token"
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.post(url, headers=headers)
    data = save_response("refresh_token", response)
    
    # Update token if successful
    if response.ok:
        access_token = data["response"]["access_token"]
        print(f"  New access token obtained: {access_token[:10]}...")
        
    return response

# User Tests
@run_test
def test_get_current_user():
    """Test getting current user info."""
    url = f"{BASE_URL}/users/me"
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(url, headers=headers)
    save_response("get_current_user", response)
    return response

@run_test
def test_update_user():
    """Test updating user info."""
    url = f"{BASE_URL}/users/me"
    headers = {"Authorization": f"Bearer {access_token}"}
    data = {
        "first_name": "Updated",
        "last_name": "User",
        "phone_number": "555-987-6543"
    }
    response = requests.put(url, json=data, headers=headers)
    save_response("update_user", response)
    return response

@run_test
def test_get_user_courses():
    """Test getting user courses."""
    url = f"{BASE_URL}/users/me/courses"
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(url, headers=headers)
    save_response("get_user_courses", response)
    return response

# Course Tests
@run_test
def test_get_all_courses():
    """Test getting all courses."""
    url = f"{BASE_URL}/courses"
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(url, headers=headers)
    save_response("get_all_courses", response)
    return response

@run_test
def test_select_courses():
    """Test selecting courses for the user."""
    # First get available courses
    url = f"{BASE_URL}/courses"
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(url, headers=headers)
    
    if not response.ok:
        raise Exception("Failed to get courses")
    
    courses = response.json()["courses"]
    # Select up to 3 courses
    course_ids = [course["id"] for course in courses[:3]]
    
    if not course_ids:
        raise Exception("No courses available")
    
    # Now select the courses
    url = f"{BASE_URL}/users/me/courses"
    data = {"course_ids": course_ids}
    response = requests.post(url, json=data, headers=headers)
    save_response("select_courses", response)
    return response

@run_test
def test_get_course_by_id():
    """Test getting a specific course."""
    # First get all courses
    url = f"{BASE_URL}/courses"
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(url, headers=headers)
    
    if not response.ok or not response.json()["courses"]:
        raise Exception("No courses available")
    
    # Get the first course ID
    course_id = response.json()["courses"][0]["id"]
    
    # Now get the specific course
    url = f"{BASE_URL}/courses/{course_id}"
    response = requests.get(url, headers=headers)
    save_response("get_course_by_id", response)
    return response

# Search Tests
@run_test
def test_basic_search():
    """Test basic search."""
    url = f"{BASE_URL}/search/basic?query=computer"
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(url, headers=headers)
    save_response("basic_search", response)
    return response

@run_test
def test_advanced_search():
    """Test advanced search."""
    url = f"{BASE_URL}/search/advanced"
    headers = {"Authorization": f"Bearer {access_token}"}
    data = {
        "query": "science",
        "entity_type": "course",
        "filters": {"term": "Spring 2025"},
        "sort_by": "name",
        "sort_direction": "asc",
        "page": 1,
        "per_page": 10
    }
    response = requests.post(url, json=data, headers=headers)
    save_response("advanced_search", response)
    return response

def generate_summary():
    """Generate test summary report."""
    successful_tests = sum(1 for result in test_results.values() if result["success"])
    total_tests = len(test_results)
    success_rate = (successful_tests / total_tests) * 100 if total_tests > 0 else 0
    
    summary = {
        "timestamp": datetime.now().isoformat(),
        "total_tests": total_tests,
        "successful_tests": successful_tests,
        "failed_tests": total_tests - successful_tests,
        "success_rate": f"{success_rate:.2f}%",
        "results": test_results
    }
    
    # Save summary to file
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    with open(os.path.join(RESULTS_DIR, f"summary_{timestamp}.json"), 'w') as f:
        json.dump(summary, f, indent=2)
    
    # Print summary
    print("\n=== TEST SUMMARY ===")
    print(f"Total Tests: {total_tests}")
    print(f"Successful: {successful_tests}")
    print(f"Failed: {total_tests - successful_tests}")
    print(f"Success Rate: {success_rate:.2f}%")
    print(f"Results saved to {RESULTS_DIR}/")
    
    return summary

def main():
    """Run all tests in the correct order."""
    print("Starting API tests...\n")
    
    # Authentication tests
    register_response = test_register()
    
    # If registration fails because user exists, update email and try again
    if register_response and register_response.status_code == 400:
        # Try with a different email
        TEST_USER["email"] = f"test{random.randint(10000, 99999)}@example.com"
        register_response = test_register()
    
    test_login()
    
    # Skip remaining tests if we don't have a token
    if not access_token:
        print("\n❌ Login failed, skipping remaining tests.")
        generate_summary()
        return
    
    test_refresh_token()
    
    # User tests
    test_get_current_user()
    test_update_user()
    test_get_user_courses()
    
    # Course tests
    test_get_all_courses()
    test_select_courses()
    test_get_course_by_id()
    
    # Search tests
    test_basic_search()
    test_advanced_search()
    
    # Generate summary
    generate_summary()

if __name__ == "__main__":
    main()
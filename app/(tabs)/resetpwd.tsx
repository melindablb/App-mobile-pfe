"use client"
import { useRouter } from "expo-router"
import type React from "react"
import { useState, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from "react-native"
import { useFonts } from "expo-font"
import icons from "@/constants/icons"

export default function PasswordResetScreen(): React.ReactElement {
  const [fontsLoaded] = useFonts({
    "Montserrat-Thin": require("../../assets/fonts/Montserrat/static/Montserrat-Thin.ttf"),
    "Montserrat-Regular": require("../../assets/fonts/Montserrat/static/Montserrat-Regular.ttf"),
    "Montserrat-SemiBold": require("../../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
    "Montserrat-Medium": require("../../assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
  })

  const router = useRouter()

  const [email, setEmail] = useState<string>("")
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [showOtpInput, setShowOtpInput] = useState<boolean>(false)
  const [generatedCode, setGeneratedCode] = useState<string>("")
  const [category, setCategory] = useState<string>("")

  // Create refs for OTP inputs
  const inputRefs = useRef<Array<TextInput | null>>([])

  // Set up refs array
  const setupRefs = (index: number, ref: TextInput | null): void => {
    inputRefs.current[index] = ref
  }

  // Handle OTP input change
  const handleOtpChange = (text: string, index: number): void => {
    // Only allow numbers
    const numericValue = text.replace(/[^0-9]/g, "")

    // Update the OTP array
    const newOtp = [...otp]
    newOtp[index] = numericValue
    setOtp(newOtp)

    // Auto-focus next input
    if (numericValue && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle backspace key press
  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number): void => {
    // Check if backspace was pressed and the input is empty
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Request password reset email with OTP
  const handleRequestReset = async (): Promise<void> => {
    if (!email) {
      setError("Please enter your email address")
      return
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    if (!category) {
      setError("Please select a category")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Simulate API call delay
      await new Promise<void>((resolve) => setTimeout(resolve, 1500))

      // Generate a random 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      console.log(`Code for ${email} (${category}): ${code}`) // For testing purposes

      setGeneratedCode(code)
      setSuccess("A 6-digit code has been sent to your email")
      setShowOtpInput(true)

      // Focus the first OTP input after a short delay
      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 100)
    } catch (err) {
      setError("Failed to send reset code")
    } finally {
      setLoading(false)
    }
  }

  // Verify OTP
  const handleVerifyOTP = async (): Promise<void> => {
    const otpCode = otp.join("")
    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit code")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Simulate API call delay
      await new Promise<void>((resolve) => setTimeout(resolve, 1500))

      // Check if the entered code matches the generated code
      if (otpCode === generatedCode) {
        setSuccess("Code verified successfully")

        // Show success alert
        Alert.alert("Success", "Code verified successfully. You can now reset your password.", [
          {
            text: "OK",
            onPress: () => {
              // Reset the form for demonstration purposes
              setEmail("")
              setOtp(["", "", "", "", "", ""])
              setCategory("")
              setShowOtpInput(false)
              setSuccess("")
              setError("")
            },
          },
        ])
      } else {
        throw new Error("Invalid code. Please try again.")
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Invalid or expired code")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <View style={styles.header}>
        <Image
          source={icons.logoR}
          style={{
            width: 50,
            height: 50,
          }}
        />
        <Text
          style={{
            fontFamily: "Montserrat-SemiBold",
            fontSize: 18,
            color: "#F05050",
            textShadowColor: "rgba(0, 0, 0,0.25)",
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 2,
          }}
        >
          E-Mergency
        </Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title2}>Reset Password</Text>
        <Text style={styles.subtitle}>
          {!showOtpInput ? "Enter your email to receive a reset code" : "Enter the 6-digit code sent to your email"}
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {success ? <Text style={styles.successText}>{success}</Text> : null}

        {/* Only show category selection when not showing OTP input */}
        {!showOtpInput && (
          <>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryContainer}>
              <TouchableOpacity
                style={[styles.categoryButton, category === "patient" && styles.categoryButtonSelected]}
                onPress={() => setCategory("patient")}
              >
                <Text style={[styles.categoryButtonText, category === "patient" && styles.categoryButtonTextSelected]}>
                  Patient
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.categoryButton, category === "healthcare pro" && styles.categoryButtonSelected]}
                onPress={() => setCategory("healthcare pro")}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    category === "healthcare pro" && styles.categoryButtonTextSelected,
                  ]}
                >
                  Healthcare Pro
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {!showOtpInput ? (
          <View style={styles.formContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email address"
              placeholderTextColor={"grey"}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity style={styles.button} onPress={handleRequestReset} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send Reset Code</Text>}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <Text style={styles.label}>Verification Code</Text>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => setupRefs(index, ref)}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="numeric"
                  maxLength={1}
                />
              ))}
            </View>
            <TouchableOpacity style={styles.button} onPress={handleVerifyOTP} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify Code</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.resendButton} onPress={handleRequestReset} disabled={loading}>
              <Text style={styles.resendButtonText}>Resend Code</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={{
          position:"relative",
          top:"15%",
          alignSelf: "center",
        }}
        activeOpacity={0.8}
        onPress={() => router.back()}
      >
        
        <Text
          style={{
            fontSize: 20,
            fontFamily: "Montserrat-SemiBold",
            color: "#F05050",
            textAlign: "center",
            textShadowColor: "rgba(0, 0, 0, 0.30)",
            textShadowOffset: { width: 0, height: 0.1 },
            textShadowRadius: 4,
          }}
        >
          Go Back
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  content: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 0.7,
    borderColor: "#9C9C9C",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title2: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 32,
    color: "#F05050",
    marginBottom: "3%",
    textShadowColor: "rgba(0, 0, 0,0.35)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: "Montserrat-SemiBold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: "4%",
    textAlign: "center",
    fontFamily: "Montserrat-Medium",
  },
  formContainer: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
    fontFamily: "Montserrat-SemiBold",
  },
  input: {
    backgroundColor: "white",
    borderWidth: 0.6,
    borderColor: "#9C9C9C",
    borderRadius: 15,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    fontFamily: "Montserrat-Medium",
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  categoryButton: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 0.6,
    borderColor: "#9C9C9C",
    borderRadius: 15,
    padding: 12,
    marginHorizontal: 6,
    alignItems: "center",
  },
  categoryButtonSelected: {
    backgroundColor: "#FFF0F0",
    borderColor: "#F05050",
  },
  categoryButtonText: {
    color: "black",
    fontSize: 14,
    fontFamily: "Montserrat-Medium",
  },
  categoryButtonTextSelected: {
    color: "#F05050",
    fontFamily: "Montserrat-SemiBold",
  },
  button: {
    backgroundColor: "#F05050",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Montserrat-SemiBold",
  },
  errorText: {
    color: "#e53e3e",
    marginBottom: "2%",
    textAlign: "center",
    fontFamily: "Montserrat-Medium",
  },
  successText: {
    color: "#38a169",
    marginBottom: "4%",
    textAlign: "center",
    fontFamily: "Montserrat-Medium",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  otpInput: {
    width: 45,
    height: 50,
    borderWidth: 0.6,
    borderColor: "#9C9C9C",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
    backgroundColor: "white",
    fontFamily: "Montserrat-Medium",
  },
  resendButton: {
    marginTop: 16,
    alignItems: "center",
  },
  header: {
    marginTop: "6%",
    marginBottom: "25%",
    flexDirection: "column",
    alignItems: "center",
  },
  resendButtonText: {
    color: "#F05050",
    fontSize: 16,
    fontFamily: "Montserrat-SemiBold",
  },
})

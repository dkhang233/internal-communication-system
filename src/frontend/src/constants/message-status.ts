class MessageStatus {
  static readonly SENDING = "SENDING" //MESSAGE IS BEING SENT TO SERVER
  static readonly SUCCESS = "SUCCESS" //MESSAGE SENT SUCCESSFULLY
  static readonly FAILED = "FAILED" //MESSAGE SENDING FAILED
  static readonly READ = "SUCCESS" //MESSAGE HAS BEEN READ
  static readonly WITHDRAW = "SUCCESS" // WITHDRAW MESSAGE
}

export default MessageStatus

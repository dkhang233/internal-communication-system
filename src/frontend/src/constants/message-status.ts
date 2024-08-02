class MessageStatus {
  static readonly SENDING = "SENDING" //MESSAGE IS BEING SENT TO SERVER
  static readonly SUCCESS = "SUCCESS" //MESSAGE SENT SUCCESSFULLY
  static readonly FAILED = "FAILED" //MESSAGE SENDING FAILED
  static readonly READ = "READ" //MESSAGE HAS BEEN READ
  static readonly WITHDRAW = "WITHDRAW" // WITHDRAW MESSAGE
}

export default MessageStatus
